import React, { useState } from "react";
import "../styles/ViolenceDetection.css";
import { BACKEND_URL } from '../config';  

const ViolenceDetection = () => {
  const [filename, setFilename] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);  // Track processing state
  const [isCameraOn, setIsCameraOn] = useState(false);      // Track camera feed state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await fetch(`${BACKEND_URL}/api/upload_vedio`, {
        method: "POST",
        body: formData,
      });
      const uploadedFilename = await response.text();
      setFilename(uploadedFilename);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handlePreview = () => {
    if (filename) {
      const previewVideo = document.getElementById("preview-video");
      previewVideo.src = `${BACKEND_URL}/static/${filename}`;
    } else {
      alert("No file uploaded to preview.");
    }
  };

  const handleProcess = async () => {
    if (isProcessing) return; // Prevent further clicks if already processing

    setIsProcessing(true); // Start processing
    setIsVideoPlaying(true); // Set video to be playing
    
    try {
      await fetch(`${BACKEND_URL}/api/start_processing`, {
        method: "POST",
        body: JSON.stringify({ filename }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const processedVideo = document.getElementById("processed-video");
      processedVideo.src = `${BACKEND_URL}/api/processed_video_feed/${filename}`;
    } catch (error) {
      console.error("Error processing video:", error);
      alert("Failed to process video. Please try again.");
    } finally {
      setIsProcessing(false); // Reset processing state once done
    }
  };

  const handleStop = () => {
    setIsVideoPlaying(false); // Stop video playing
    const processedVideo = document.getElementById("processed-video");
    processedVideo.src = ""; // Clear the video source
  };

  const handleCamera = async () => {
    if (isCameraOn) {
      // Stop the camera feed if it's already on
      setIsCameraOn(false);
      const processedVideo = document.getElementById("processed-video");
      processedVideo.src = ""; // Clear the video source
    } else {
      // Start the camera feed
      setIsCameraOn(true);
      await fetch(`${BACKEND_URL}/api/start_processing`, {
        method: "POST",
        body: JSON.stringify({ filename: "camera" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const processedVideo = document.getElementById("processed-video");
      processedVideo.src = `${BACKEND_URL}/api/camera_feed`;
    }
  };

  return (
    <div className="violence-container">
      <form onSubmit={handleUpload}>
        <input type="file" name="file" required />
        <input type="submit" value="Upload" />
      </form>
      <div className="button-container">
        <button onClick={handlePreview} disabled={!filename}>Preview</button>
        <button 
          onClick={isVideoPlaying ? handleStop : handleProcess} 
          disabled={!filename || isProcessing}
        >
          {isProcessing 
            ? "Checking for Violence..." 
            : (isVideoPlaying ? "Stop Checking" : "Check for Violence")
          }
        </button>
        <button onClick={handleCamera}>
          {isCameraOn ? "Stop Camera Feed" : "Open Camera"}
        </button>
      </div>
      <div className="video-container">
        <video id="preview-video" controls></video>
        <img id="processed-video" alt="" />
      </div>
    </div>
  );
};

export default ViolenceDetection;
