import React, { useEffect, useState, useRef } from "react";
import sample from "../../assets/video/sample.mp4";

// Subtitle Parsing Function
const parseSRT = (srt: string) => {
  const subtitleLines = srt.split("\n\n"); // Split sections by empty lines
  const subtitles = subtitleLines.map((line) => {
    const [index, timeRange, ...textLines] = line.split("\n");

    // Validate that timeRange exists and is valid
    if (!timeRange || !textLines.length) return null;

    // Split the time range only if it's properly formatted
    const timeParts = timeRange.split(" --> ");
    if (timeParts.length !== 2) return null; // Invalid time range format
    
    const [startTime, endTime] = timeParts.map((time) => {
      // Check if time is valid before splitting
      if (!time) return 0;
      return convertToSeconds(time);
    });

    const text = textLines.join(" ").trim();

    // Only return valid subtitle objects
    return {
      startTime,
      endTime,
      text,
    };
  });

  // Filter out any null or invalid subtitles
  return subtitles.filter((sub) => sub !== null);
};

// Convert "hh:mm:ss,ms" to seconds
const convertToSeconds = (time: string) => {
  if (!time) return 0; // Guard clause to handle empty or invalid time

  const [hours, minutes, rest] = time.split(":");
  const [seconds, milliseconds] = rest.split(",");

  // Ensure we have all parts of the time
  if (!hours || !minutes || !seconds || !milliseconds) return 0;

  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(seconds) +
    parseInt(milliseconds) / 1000
  );
};

// SRT Content (Simulated from Backend)
const srtContent = `
1
00:00:00,000 --> 00:00:09,640
世界最古の建造物として知られる魚べくり、テペはトルコ南東部に位置し、広告学会を驚かせています。

2
00:00:09,640 --> 00:00:17,240
この遺跡は約12000年前に建てられたとされ、人類の文明詞を大きく塗り替えました。

3
00:00:17,240 --> 00:00:24,120
謎めいた石中や動物の彫刻は、未だにその目的を解き明されていません。

4
00:00:24,120 --> 00:00:34,360
この遺跡は宗教的な儀式の場であったと考えられていますが、各たる証拠はなく、科学者たちは論争を続けています。

5
00:00:34,360 --> 00:00:41,960
他にも魚べくり、テペは濃厚の発達に影響を与えた可能性も指摘されています。

6
00:00:41,960 --> 00:00:56,800
建築技術やその社会構造についての理解は、当時の未知なる文化に迫る手掛かりを与えており、人類史上最大の謎の一つとして、今も研究が進められています。
`;

const VideoDisplay: React.FC = () => {
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Parse the SRT content when the component mounts
    const parsedSubtitles = parseSRT(srtContent);
    setSubtitles(parsedSubtitles);
  }, []);

  // Update subtitle based on video time
  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    const subtitle = subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );
    setCurrentSubtitle(subtitle ? subtitle.text : "");
  };

  return (
    <div className="relative w-full h-full bg-black flex justify-center items-center">
      {/* Video */}
      <video
        className="relative w-full h-[230px] z-10"
        controls
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        src={sample}
      >
        Your browser does not support the video tag.
      </video>

      {/* Subtitle */}
      {currentSubtitle && (
        <div
          className="absolute bottom-10 text-white bg-black bg-opacity-50 p-2 rounded text-center w-full"
          style={{ zIndex: 20 }}
        >
          {currentSubtitle}
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
