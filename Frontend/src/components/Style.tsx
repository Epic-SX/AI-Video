import React, { useState } from "react";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import StyleCard from "./utils/StyleCard";
import { cardData } from "../constants/cardData";
import { useVideoContext } from "../context/VideoContext";

interface StyleProps {
  selectedCard: number; // Passed from Create.tsx
  setSelectedCard: (id: number) => void; // Setter from Create.tsx
}

export default function Style({ selectedCard, setSelectedCard }: StyleProps) {
  const [activeButton, setActiveButton] = useState<null | string>("動画スタイル");
  const { setStyleTitle } = useVideoContext();

  const handleStyle = (id: number, title: string) => {
    setSelectedCard(id); // Update parent state
    setStyleTitle(title);
  };

  return (
    <div className="w-full font-sans min-h-[calc(100vh-82px)] relative bg-gray-50">
      <div className="flex w-11/12 flex-col mx-auto items-center justify-center">
        {/* Header */}
        <div className="flex items-center pt-4">
          <p className="text-[24px] font-bold">どの動画スタイルで始めますか？</p>
          <HiMiniQuestionMarkCircle className="text-gray-400 text-3xl" />
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-3/4 justify-center gap-6 pt-4 border-b-[1px] border-gray-200">
          <button
            onClick={() => setActiveButton("動画スタイル")}
            className={`text-[18px] pb-1 border-b-2 ${
              activeButton === "動画スタイル"
                ? "border-[#24B7D0]"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            動画スタイル
          </button>
          <button
            onClick={() => setActiveButton("マイ動画スタイル")}
            className={`text-[18px] pb-1 border-b-2 ${
              activeButton === "マイ動画スタイル"
                ? "border-[#24B7D0]"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            マイ動画スタイル(0)
          </button>
        </div>

        {/* Conditional Rendering */}
        <div className="w-3/4 mt-8 pr-2 overflow-y-auto h-[700px]">
          {activeButton === "動画スタイル" && (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {cardData.map((card, index) => (
                <StyleCard
                  key={card.id}
                  id={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  isSelected={selectedCard === index+1} // Check if selected
                  onClick={() => handleStyle(card.id, card.title)} // Set selected card
                />
              ))}
            </div>
          )}

          {activeButton === "マイ動画スタイル" && (
            <div>
              <button className="bg-[#F1EAFF] hover:bg-[#f1eaf1] rounded-lg px-10 py-8 border-2 border-[#e5d8ff] border-dotted text-gray-500 text-lg">
                オリジナル動画スタイルを作る。
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
