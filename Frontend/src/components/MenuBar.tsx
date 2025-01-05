import React from "react";
import create from "../assets/image/ic_startmode-BuGMTegX.svg";
import FontSizeSelector from "./utils/FontSize";
import ColorPicker from "./utils/ColorPicker";
import Create from "../pages/Create"; // Import Create component
import { useVideoContext } from "../context/VideoContext"

export default function MenuBar() {
  const { isModalOpen, setIsModalOpen } = useVideoContext(); // State to manage modal visibility

  // Handle opening and closing of the modal
  const handleCreateClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="font-sans h-[82px] flex border-[1px] border-gray-200 pl-4">
      <div className="flex flex-col p-2 my-4 justify-center items-center border-r-[1px] border-gray-400">
        <img
          src={create}
          alt="create"
          className="w-6 h-6"
          onClick={handleCreateClick} // Trigger modal open on click
        />
        <p className="text-[11px] pt-2">新規で作成</p>
      </div>
      <div className="flex justify-center items-center px-4">
        <select className="border-[1px] border-gray-200 h-10 focus:outline-none rounded-md">
          <option value="">Noto Sans JP</option>
          <option value="">IBM Plex Serif Bold</option>
        </select>
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
