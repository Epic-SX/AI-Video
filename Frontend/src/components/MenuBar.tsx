import React, { useState } from "react";
import create from "../assets/image/ic_startmode-BuGMTegX.svg";
import FontSizeSelector from "./utils/FontSize";
import ColorPicker from "./utils/ColorPicker";
import FontPicker from "font-picker-react";
import Create from "../pages/Create"; // Import Create component
import { useVideoContext } from "../context/VideoContext"
import { HiFolderPlus } from "react-icons/hi2";
import { HiFolderDownload } from "react-icons/hi";


export default function MenuBar() {
  const { isModalOpen, setIsModalOpen } = useVideoContext(); // State to manage modal visibility
  const [activeFontFamily, setActiveFontFamily] = useState("Open Sans");
  const { srtContent } = useVideoContext();

  // Handle opening and closing of the modal
  const handleCreateClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleDownload = async () => {
    if (!srtContent) {
      console.error("srtContent is missing");
      return;
    }

    try {
      const videoUrl = `${process.env.REACT_APP_API_BASE_URL}/api/video`;
      const response = await fetch(videoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ srtContent }), // Send srtContent in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4"; // Set the desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the video:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="font-sans h-[82px] flex border-[1px] border-gray-200 pl-4">
      <div className="flex flex-col p-2 my-2 justify-center items-center">
        <HiFolderPlus className="text-[32px] text-[#24B7D0] hover:cursor-pointer" onClick={handleCreateClick} />
        <p className="text-[11px] pt-2">新規で作成</p>
      </div>
      <div className="flex flex-col my-2 p-2 justify-center items-center border-r-[1px] border-gray-400">
        <HiFolderDownload className="text-[32px] text-[#24B7D0] hover:cursor-pointer" onClick={handleDownload} />
        <p className="text-[11px] pt-2">ビデオ出力</p>
      </div>

      <div className="flex justify-center z-50 items-center px-4">
        <FontPicker
          apiKey={process.env.REACT_APP_FONT_KEY as string}
          activeFontFamily={activeFontFamily}
          onChange={(nextFont: { family: string }) => setActiveFontFamily(nextFont.family)}
        />
      </div>
      <FontSizeSelector />
      <ColorPicker />

      {/* Modal for Create component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-5/6 ">
            {/* Pass handleCloseModal to Create component */}
            <Create handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
