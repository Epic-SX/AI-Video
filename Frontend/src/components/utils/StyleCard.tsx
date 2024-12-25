import React from "react";

interface CardProps {
  id: number; // Update type if not already
  image: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick?: () => void;
}
const StyleCard: React.FC<CardProps> = ({
  id,
  image,
  title,
  description,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`h-[340px] p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        isSelected ? "border-[#24B7D0]" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      {/* Title Section */}
      <h3 className="text-lg font-bold text-left text-gray-800 flex items-center gap-2 mb-2">
        {title}
      </h3>
      {/* Description Section */}
      <p className="text-sm text-gray-600 text-left">{description}</p>
    </div>
  );
};

export default StyleCard;
