import React, { useState, useRef } from "react";
import Header from "../components/Header";
import Size from "../components/Size";
import Style from "../components/Style";
import Creation from "../components/Creation";
import { useVideoContext } from "../context/VideoContext";

interface CreateProps {
  handleCloseModal: () => void;
}

function Create({ handleCloseModal }: CreateProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string>("youtube"); // Persisted state for Size
  const [selectedCard, setSelectedCard] = useState<number>(1); // Default to the first style (id = 1)
  const creationRef = useRef<{ completeModal: () => void; handleTopic: () => void }>(null);
  const { styleTitle, videoLoading } = useVideoContext();

  const handleStyleComplete = () => {
    creationRef.current?.handleTopic();
  };

  const handleNext = () => {
    if (activeStep === 2 && styleTitle !== "スタイルなしで始める") {
      handleStyleComplete();
    }
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleComplete = () => {
    creationRef.current?.completeModal();
  };

  return (
    <div>
      <Header activeStep={activeStep} onClose={handleCloseModal} />
      <div>
        {activeStep === 1 && (
          <Size selected={selectedStyle} setSelected={setSelectedStyle} />
        )}
        {activeStep === 2 && (
          <Style selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
        )}
        <div style={{ display: activeStep === 3 ? "block" : "none" }}>
          <Creation ref={creationRef} />
        </div>
      </div>
      <div className="w-4/1 flex gap-4 items-end justify-end pb-5 absolute bottom-3 right-48">
        {!videoLoading &&
          <button
            className="px-8 py-2 z-10 bg-[#eefcfd] hover:bg-[#cbeff1] rounded-lg text-[#24B7D0]"
            onClick={handlePrev}
            disabled={activeStep === 1}
          >
            前へ
          </button>}
        {!videoLoading && (activeStep < 3 ? (
          <button
            className="px-8 py-2 bg-[#24B7D0] hover:bg-[#2092a7] rounded-lg text-white"
            onClick={handleNext}
            disabled={activeStep === 3}
          >
            次へ
          </button>
        ) : (
          <button
            className="px-8 py-2 bg-[#24B7D0] z-10 hover:bg-[#2092a7] rounded-lg text-white"
            onClick={handleComplete}
          >
            完了
          </button>
        ))}

      </div>
    </div>
  );
}

export default Create;
