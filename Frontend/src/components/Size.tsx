import React, { useState } from "react";
import youtube from "../assets/image/ic_ttv_widescreen_selected-vwm1xUbe.svg";
import short from "../assets/image/ic_ttv_vertical_selected-BdU7AQ-G.svg";
import instagram from "../assets/image/ic_ttv_instagram-DzEW-y9C.svg";
import square from "../assets/image/ic_ttv_square-lHwfcHHo.svg";
import classic from "../assets/image/ic_ttv_classic-DwpC8dG1.svg";

export default function Size() {
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (style: string) => {
    setSelected(style);
    console.log(`Selected style: ${style}`);  // Check if the style is being correctly set
  };

  return (
    <div className="w-full font-sans min-h-[calc(100vh-82px)] relative bg-gray-50">
      <div className="flex w-3/4 flex-col mx-auto items-center justify-center">
        <div className="flex flex-col items-center font-sans">
          <p className="py-8 text-[24px] font-bold">
            どの比率の動画を作成しますか？
          </p>

          {/* Youtube 16:9 */}
          <div
            onClick={() => handleSelect("youtube")}
            className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg pl-16 py-2 border-[1px] transition-colors duration-300 
              ${selected === "youtube" ? "border-[#24B7D0] bg-[#eefcfd]" : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"}`}
          >
            <img src={youtube} alt="youtube" />
            <p>Youtube 16:9</p>
          </div>

          {/* Short 9:16 */}
          <div
            onClick={() => handleSelect("short")}
            className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg pl-16 py-2 border-[1px] transition-colors duration-300 
              ${selected === "short" ? "border-[#24B7D0] bg-[#eefcfd]" : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"}`}
          >
            <img src={short} alt="short" />
            <p>ショート 9:16</p>
          </div>

          {/* Instagram 4:5 */}
          <div
            onClick={() => handleSelect("instagram")}
            className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg pl-16 py-2 border-[1px] transition-colors duration-300 
              ${selected === "instagram" ? "border-[#24B7D0] bg-[#eefcfd]" : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"}`}
          >
            <img src={instagram} alt="instagram" />
            <p>instagram 4:5</p>
          </div>

          {/* Square 1:1 */}
          <div
            onClick={() => handleSelect("square")}
            className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg gap-2 pl-16 py-2 border-[1px] transition-colors duration-300 
              ${selected === "square" ? "border-[#24B7D0] bg-[#eefcfd]" : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"}`}
          >
            <img src={square} alt="正方形" />
            <p>正方形 1:1</p>
          </div>

          {/* Classic 4:3 */}
          <div
            onClick={() => handleSelect("classic")}
            className={`flex items-center cursor-pointer w-72 mb-4 rounded-lg pl-16 py-2 border-[1px] transition-colors duration-300 
              ${selected === "classic" ? "border-[#24B7D0] bg-[#eefcfd]" : "border-gray-200 hover:border-gray-300 hover:bg-[#f0f0f0]"}`}
          >
            <img src={classic} alt="classic" />
            <p>クラシック 4:3</p>
          </div>

        </div>
      </div>

      
    </div>
  );
}
