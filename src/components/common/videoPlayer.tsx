import React, { useRef, useState } from "react";
import "@src/assets/css/content.scss";
import ChatUI from "./chatUI";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router";

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const navigate = useNavigate();

  const [maxAiChat, setMaxAiChat] = useState(false);

  const [playedSeconds, setPlayedSeconds] = useState(0); // Store timestamp

  const playerRef = useRef<ReactPlayer>(null);
  console.log(url);

  return (
    <div
      className={`video-chat-box-container ${
        maxAiChat ? "max-chat" : "min-chat"
      }`}
    >
      <div className="video-container d-flex flex-column">
        <div className="video ">
          {" "}
          <ReactPlayer
            ref={playerRef}
            url={url}
            onPlay={() => setMaxAiChat(false)}
            controls
            playing={!maxAiChat}
            width="100%"
            height="100%"
            onProgress={(progress) => setPlayedSeconds(progress.playedSeconds)}
          />
        </div>
        <p className="video-title">Introduction to Quantum mechanics</p>
        <p className="video-des">Description Description Description</p>
        <div className="btn-wrapper d-flex align-center">
          <button className="download-button">Download notes</button>
          <button
            className="download-button"
            onClick={() => navigate("/study-zone?section=quiz")}
          >
            Take Quiz
          </button>
        </div>
        {maxAiChat ? (
          <p>Current Timestamp: {playedSeconds.toFixed(2)}s</p>
        ) : (
          <></>
        )}
      </div>

      <div className="ai-assistant d-flex flex-column">
        <div className="chat-wrapper">
          {/* <div className="icon" onClick={() => setMaxAiChat(!maxAiChat)}>
            <ArrowBackIosIcon />
          </div> */}
          <div className="title">
            <h2>JEE AI Assistant</h2>
            <p>Ask anything about Physics, Chemistry, or Mathematics</p>
          </div>

          {/* <p>
          Hello! I'm your AI learning assistant. Feel Free to ask any questions
          about the video content.
        </p> */}
          <ChatUI setMaxAiChat={setMaxAiChat} />
        </div>
        {/* <div className="faq-wrapper d-flex flex-column">
          <p className="title">Recent Questions</p>
          {faqs.map((faq, index) => (
            <div key={index} className="user-question d-flex flex-column">
              {faq.question}
              <span>Asked 15 minutes ago</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default VideoPlayer;
