import { useState } from "react";
import Voice from "@src/assets/icons/voice.svg";
import Img from "@src/assets/icons/img.svg";
import { baseUrl, post } from "@utils/coreApiServices";
interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatUIProps {
  setMaxAiChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatUI({ setMaxAiChat }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [activeChantId, setActiveChatId] = useState("");
  const [input, setInput] = useState<string>("");
  const token = localStorage.getItem("accessToken");
  const sendMessage = async () => {
    if (!input.trim()) return;
    let oldMessages = messages;
    oldMessages = [...oldMessages, { text: input, sender: "user" }];
    setInput("");
    setMessages(oldMessages);
    const res = await post(
      `${baseUrl}api/v1/chat/conversation`,
      {
        user_text_input: input,
        chat_id: activeChantId ? activeChantId : null,
      },
      { AUTHORIZATION: `Bearer ${token}` }
    );
    if (res?.data) {
      oldMessages = [
        ...oldMessages,
        { text: res.data.llm_output, sender: "bot" },
      ];
      setMessages(oldMessages);
      setActiveChatId(res?.data.chat_id);
      setMaxAiChat(false);
    }
  };

  const captureVoice = () => {
    setMaxAiChat(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };

  const handleInputChange = (val: string) => {
    setMaxAiChat(true);
    setInput(val);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className="d-flex " key={index}>
            {" "}
            <div className="name">
              {msg.sender === "user" ? "U" : "AI"}
            </div>{" "}
            <div
              key={index}
              className={`message d-flex align-center ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="chat-input-container d-flex align-center">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <div className="voice-image d-flex justify-center align-center">
          <button onClick={captureVoice} className="chat-voice-button">
            <img alt="voice" src={Voice} />
          </button>
          <button>
            <img alt="img" src={Img} />
          </button>
        </div>

        <button onClick={sendMessage} className="chat-send-button">
          sent
        </button>
      </div>
    </div>
  );
}
