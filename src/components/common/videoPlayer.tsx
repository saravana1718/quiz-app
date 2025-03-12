import React, { useRef, useState, useEffect } from "react";
import "@src/assets/css/content.scss";
import ChatUI from "./chatUI";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router";
import html2canvas from "html2canvas";

const VideoPlayer: React.FC<{ url: string ,transcript:string}> = ({ url,transcript }) => {
  const navigate = useNavigate();
  const playerRef = useRef<ReactPlayer>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [maxAiChat, setMaxAiChat] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);


  const captureRef = useRef<HTMLDivElement>(null); // Reference to the entire video player
  const captureVideoFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image
        const imageData = canvas.toDataURL("image/png");
        setScreenshot(imageData);
        console.log("Captured Frame:", imageData);
      }
    }
  };
  // Capture screenshot when maxAiChat is enabled
  // useEffect(() => {
  //   if (maxAiChat) {
  //     captureVideoFrame();
  //   }
  // }, [maxAiChat]);

  return (
    <div
   
      className={`video-chat-box-container ${
        maxAiChat ? "max-chat" : "min-chat"
      }`}
    >
      <div className="video-container d-flex flex-column">
        <div className="video">
          {/* Video Player */}
          <ReactPlayer
            ref={playerRef}
            url={url}
            onPlay={() => setMaxAiChat(false)}
            controls
            playing={!maxAiChat}
            width="100%"
            height="100%"
            onProgress={(progress) => setPlayedSeconds(progress.playedSeconds)}
            onReady={() => {
              // Access the internal video element of ReactPlayer
              if (playerRef.current) {
                const internalPlayer = playerRef.current.getInternalPlayer();
                if (internalPlayer instanceof HTMLVideoElement) {
                  videoRef.current = internalPlayer;
                }
              }
            }}
        
          />

          {/* Show Captured Screenshot */}
    
        </div>
        <p className="video-title">Introduction to Quantum Mechanics</p>
        <p className="video-des">Description Description Description</p>
        <div className="btn-wrapper d-flex align-center">
          <button className="download-button">Download Notes</button>
          <button
            className="download-button"
            onClick={() => navigate("/study-zone?section=quiz")}
          >
            Take Quiz
          </button>
        </div>
        {maxAiChat && <p>Current Timestamp: {playedSeconds.toFixed(2)}s</p>}
        {screenshot && (
            <div className="screenshot-preview">
              <img src={screenshot} alt="Video Screenshot" />
            </div>
          )}
      </div>

      {/* Hidden Canvas for Screenshot Capture */}
      
      
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
          <ChatUI setMaxAiChat={setMaxAiChat} transcript={transcript} maxAiChat={maxAiChat} playedSeconds={playedSeconds} />
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
