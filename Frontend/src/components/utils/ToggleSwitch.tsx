import React, { useState } from "react";

const ToggleSwitch = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleHandler = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <span className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isToggled}
            onChange={toggleHandler}
          />
          <div
            className={`w-12 h-6 rounded-full transition-colors ${
              isToggled ? "bg-[#24B7D0]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
              isToggled ? "translate-x-6" : ""
            }`}
          ></div>
        </span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
