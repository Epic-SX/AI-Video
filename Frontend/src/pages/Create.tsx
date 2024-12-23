import React, { useState, useRef} from "react";
import Header from "../components/Header";
import Size from "../components/Size";
import Style from "../components/Style";
import Creation from "../components/Creation";

// Define an interface for the props
interface CreateProps {
  handleCloseModal: () => void; // Specify the type for handleCloseModal
}


function Create({ handleCloseModal }: CreateProps) {
  const [activeStep, setActiveStep] = useState(1);
  const creationRef = useRef<{ handleScript: () => void }>(null);

  const handleNext = () => {
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleComplete = () => {
    creationRef.current?.handleScript();
  };

  const renderComponent = () => {
    switch (activeStep) {
      case 1:
        return <Size />;
      case 2:
        return <Style />;
      case 3:
        return <Creation ref={creationRef} />;
      default:
        return <Size />;
    }
  };

  return (
    <div>
      <Header activeStep={activeStep} onClose={handleCloseModal} />
      {renderComponent()}
      <div className="w-4/1 flex gap-4 items-end justify-end pb-5 absolute bottom-3 right-48">
        <button
          className="px-8 py-2 bg-[#eefcfd] hover:bg-[#cbeff1] rounded-lg text-[#24B7D0]"
          onClick={handlePrev}
          disabled={activeStep === 1}
        >
          前へ
        </button>

        {activeStep < 3 ? (
          <button
            className="px-8 py-2 bg-[#24B7D0] hover:bg-[#2092a7] rounded-lg text-white"
            onClick={handleNext}
            disabled={activeStep === 3}
          >
            次へ
          </button>
        ) : (
          <button
            className="px-8 py-2 bg-[#24B7D0] hover:bg-[#2092a7] rounded-lg text-white"
            onClick={handleComplete}
          >
            完了
          </button>
        )}
      </div>
    </div>
  );
}

export default Create;
