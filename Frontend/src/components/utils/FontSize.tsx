import React from "react";
import { useVideoContext } from "../../context/VideoContext";

const FontSizeSelector: React.FC = () => {
  const { activeFontSize, setActiveFontSize } = useVideoContext();

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = event.target.value;
    setActiveFontSize(Number(newFontSize)); // Ensure the value is converted to a number
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Fixed AA Icon */}
      <button
        className="text-lg font-bold cursor-default"
        aria-label="Font size icon"
      >
        <span className="text-[11px]">A</span>
        <span className="text-[15px]">A</span>
      </button>

      {/* Dropdown Menu */}
      <select
        value={activeFontSize}
        onChange={handleFontSizeChange}
        className="border border-gray-300 rounded-md p-1 h-10  text-sm focus:outline-none"
      >
        {/* Options */}
        {[25, 50, 75, 90, 100, 110, 125, 150].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSizeSelector;