import React from "react";
import sample from "../../assets/video/sample.mp4";

const VideoDisplay: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-black flex justify-center items-center">
      {/* Video */}
      <video className="relative w-full h-[230px] z-10" controls src={sample}>
        Your browser does not support the video tag.
      </video>

      {/* Subtitle */}
    </div>
  );
};

export default VideoDisplay;
