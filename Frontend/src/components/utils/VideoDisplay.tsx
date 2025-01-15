import React, { useEffect, useState, useRef } from "react";
import SrtParser from "srt-parser-2";
import sample from "../../assets/video/output_video.mp4";
import { useVideoContext } from "../../context/VideoContext";

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

const VideoDisplay: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>(sample); // Default to sample video
  const videoRef = useRef<HTMLVideoElement>(null);
  const { srtContent } = useVideoContext();

  // Parse and update subtitles whenever srtContent changes
  useEffect(() => {
    const parser = new SrtParser();

    const timeToSeconds = (time: string) => {
      const [hours, minutes, seconds] = time.split(":");
      const [sec, ms] = seconds.split(",");
      return (
        Number(hours) * 3600 + Number(minutes) * 60 + Number(sec) + Number(ms) / 1000
      );
    };

    if (srtContent) {
      try {
        const parsedSubtitles = parser.fromSrt(srtContent);
        const formattedSubtitles: Subtitle[] = parsedSubtitles.map((sub: any) => ({
          startTime: timeToSeconds(sub.startTime),
          endTime: timeToSeconds(sub.endTime),
          text: sub.text,
        }));
        setSubtitles(formattedSubtitles);
      } catch (error) {
        console.error("Error parsing SRT content", error);
      }
    }
  }, [srtContent]);

  // Fetch new video URL from the backend when srtContent changes
  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (srtContent) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/video`,
            {
              method: "POST", // Changed to POST
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ srtContent }), // Send srtContent in the request body
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch video URL");
          }

          const blob = await response.blob();
          const videoBlobUrl = URL.createObjectURL(blob); // Create a blob URL for the video
          setVideoUrl(videoBlobUrl);
        } catch (error) {
          console.error("Error fetching video URL:", error);
        }
      } else {
        setVideoUrl(sample); // Fallback to sample video
      }
    };

    fetchVideoUrl();
  }, [srtContent]);

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    const subtitle = subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );

    setCurrentSubtitle(subtitle ? subtitle.text : "");
  };

  return (
    <div className="relative w-full h-full  bg-black flex justify-center items-center">
      <video
        key={videoUrl} // Remount video when URL changes
        className="relative w-full h-[230px] z-10"
        controls
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setCurrentSubtitle("")}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {currentSubtitle && (
        <div className="absolute bottom-10 text-white p-3 rounded text-center w-full z-20">
          {currentSubtitle}
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
