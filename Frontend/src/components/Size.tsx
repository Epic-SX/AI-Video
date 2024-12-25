import React from "react";
import selected_youtube from "../assets/image/ic_ttv_widescreen_selected-vwm1xUbe.svg";
import youtube from "../assets/image/ic_ttv_widescreen-6a-5h8od.svg";
import selected_short from "../assets/image/ic_ttv_vertical_selected-BdU7AQ-G.svg";
import short from "../assets/image/ic_ttv_vertical-CItBt6ef.svg";
import instagram from "../assets/image/ic_ttv_instagram-DzEW-y9C.svg";
import selected_instagram from "../assets/image/ic_ttv_instagram_selected-CqkrFZSL.svg";
import square from "../assets/image/ic_ttv_square-lHwfcHHo.svg";
import selected_square from "../assets/image/ic_ttv_square_selected-BAnXlaV7.svg";
import classic from "../assets/image/ic_ttv_classic-DwpC8dG1.svg";
import selected_classic from "../assets/image/ic_ttv_classic_selected-BTZqT7sb.svg";

interface SizeProps {
  selected: string;
  setSelected: (style: string) => void;
}

export default function Size({ selected, setSelected }: SizeProps) {
  const handleSelect = (style: string) => {
    setSelected(style);
    console.log(`Selected style: ${style}`);
  };

  const getImage = (
    style: "youtube" | "short" | "instagram" | "square" | "classic",
    isSelected: boolean
  ) => {
    const images = {
      youtube: isSelected ? selected_youtube : youtube,
      short: isSelected ? selected_short : short,
      instagram: isSelected ? selected_instagram : instagram,
      square: isSelected ? selected_square : square,
      classic: isSelected ? selected_classic : classic,
    };
    return images[style];
  };

  const styleLabels: Record<string, string> = {
    youtube: "Youtube 16:9",
    short: "ショート 9:16",
    instagram: "Instagram 4:5",
    square: "正方形 1:1",
    classic: "クラシック 4:3",
  };

  return (
    <div className="w-full font-sans min-h-[calc(100vh-82px)] relative bg-gray-50">
      <div className="flex w-3/4 flex-col mx-auto items-center justify-center">
        <div className="flex flex-col items-center font-sans">
          <p className="py-8 text-[24px] font-bold">
            どの比率の動画を作成しますか？
          </p>
          {["youtube", "short", "instagram", "square", "classic"].map((style) => (
            <div
              key={style}
              onClick={() => handleSelect(style)}
              className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg pl-16 py-2 border-[1px] transition-colors duration-300 
              ${
                selected === style
                  ? "border-[#24B7D0] bg-[#eefcfd]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"
              }`}
            >
              <img src={getImage(style as any, selected === style)} alt={style} />
              <p>{styleLabels[style]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
