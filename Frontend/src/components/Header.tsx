import React from "react";

interface HeaderProps {
  activeStep: number; // Receiving the activeStep as a prop
  onClose: () => void; // Adding onClose as a prop to handle modal close
}

export default function Header({ activeStep, onClose }: HeaderProps) {
  const steps = [
    { number: 1, label: "画面の比率を決める" },
    { number: 2, label: "動画スタイルを選択する" },
    { number: 3, label: "動画を作成" },
  ];

  return (
    <div className="font-sans pt-6 pb-6 border-b-[1px] border-[#D9D9D9] flex justify-between">
      <span></span>
      <div className="flex justify-center gap-12">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-3 cursor-pointer">
            <p
              className={`w-8 h-8 rounded-md flex justify-center items-center ${
                activeStep === step.number
                  ? "text-white bg-gray-600"
                  : "text-white bg-gray-400"
              }`}
            >
              {step.number}
            </p>
            <p
              className={`${
                activeStep === step.number ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
            {step.number !== steps.length && (
              <p className="border-t-[1px] w-16 mt-4 border-dashed"></p>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        {/* Use onClick to trigger the onClose prop */}
        <div
          className="flex gap-1 pr-4 text-gray-500 cursor-pointer"
          onClick={onClose} // Call onClose when clicked
        >
          <p>閉じる</p>
          <p>×</p>
        </div>
      </div>
    </div>
  );
}
