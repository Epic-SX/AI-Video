import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import { useVideoContext } from "../../context/VideoContext";

const ColorPickerButton: React.FC = () => {
  const { activeFontColor, setActiveFontColor } = useVideoContext();
  const [showPicker, setShowPicker] = useState(false); // State to toggle color picker visibility
  const pickerRef = useRef<HTMLDivElement>(null); // Reference for detecting outside clicks

  const handleColorChange = (updatedColor: any) => {
    setActiveFontColor(updatedColor.hex); // Update selected color
  };

  // Handle clicks outside the picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false); // Close the picker if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative text-center z-50 my-5">
      {/* Button with dynamic bottom color */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="relative px-4 mx-4 py-[6px] text-lg font-medium bg-white border border-gray-300 rounded-lg cursor-pointer"
      >
        A
        {/* Bottom color strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg"
          style={{ backgroundColor: activeFontColor }}
        ></div>
      </button>

      {/* ChromePicker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-10 mt-3 left-1/2 -translate-x-1/2"
        >
          <ChromePicker
            color={activeFontColor}
            onChange={handleColorChange}
            disableAlpha // Disable transparency slider
          />
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;