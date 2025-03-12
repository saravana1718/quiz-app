import { useEffect, useState } from "react";
import Voice from "@src/assets/icons/voice.svg";
import Img from "@src/assets/icons/img.svg";
import { baseUrl, post } from "@utils/coreApiServices";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm"; // Enables GitHub-flavored Markdown (lists, tables, etc.)
import "katex/dist/katex.min.css"; // Import KaTeX styles for math rendering

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatUIProps {
  setMaxAiChat: React.Dispatch<React.SetStateAction<boolean>>;
  transcript:string;
  playedSeconds:number;
  maxAiChat:boolean;
}

export default function ChatUI({ setMaxAiChat,transcript,playedSeconds,maxAiChat }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [activeChantId, setActiveChatId] = useState("");
  const [input, setInput] = useState<string>("");
  const token = localStorage.getItem("accessToken");

  const extractClosestTranscripts = (transcript: string, playedSeconds: number): string => {
    const transcriptEntries = transcript
      .split("\n")
      .map((line) => {
        const match = line.match(/\[(\d+):(\d+):([\d.]+)\]\s(.+)/); // Extract timestamp and text
        if (!match) return null;
  
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseFloat(match[3]);
  
        const totalSeconds = minutes * 60 + seconds + milliseconds; // Convert timestamp to seconds
        return { time: totalSeconds, text: line }; // Store full original line
      })
      .filter((entry): entry is { time: number; text: string } => entry !== null);
  
    if (transcriptEntries.length === 0) return "";
  
    // Sort transcripts by time
    transcriptEntries.sort((a, b) => a.time - b.time);
  
    // Find the closest transcript entry
    let closestIndex = transcriptEntries.findIndex((entry) => entry.time >= playedSeconds);
    if (closestIndex === -1) closestIndex = transcriptEntries.length - 1;
  
    // Get 2 before and 2 after the closest
    const start = Math.max(0, closestIndex - 2);
    const end = Math.min(transcriptEntries.length, closestIndex + 2);
  
    // Join them into a single formatted string
    return transcriptEntries.slice(start, end + 1).map((entry) => entry.text).join("\n");
  };
  
  


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
        "transcription": extractClosestTranscripts(transcript, playedSeconds),
      },
      { AUTHORIZATION: `Bearer ${token}` }
    );
    if (res?.data) {
      oldMessages = [
        ...oldMessages,
        {
          text: res.data.llm_output.replace(/\n/g, "\n\n"), // Ensuring proper spacing
          sender: "bot",
        },
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
              <p style={{ whiteSpace: "pre-line" }}>  <ReactMarkdown
    remarkPlugins={[remarkMath, remarkGfm]}
    rehypePlugins={[rehypeKatex]} // Enables LaTeX rendering
  >
    {msg.text}
  </ReactMarkdown> </p>
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
