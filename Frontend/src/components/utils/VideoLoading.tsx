import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import image from "../../assets/image/ttv_sample_image-C91yQb0W.gif"

export default function VideoLoading() {
    const [progress, setProgress] = React.useState(0);
    const [step, setStep] = React.useState(0); // Step to control which message to display

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random()*0.4;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    React.useEffect(() => {
        // Timer to switch between steps
        const timer = setInterval(() => {
            setStep((prevStep) => (prevStep + 1) % 3); // Cycle through 0, 1, 2
        }, 60000); // 1 minute intervals

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-[500px]">
            <div className='flex justify-center pb-4'>
                {step === 0 && <p>AI音声が台本を読み上げています...</p>}
                {step === 1 && <p>台本に合う画像を生成しています...</p>}
                {step === 2 && <p>動画に音楽と効果を追加しています...</p>}
            </div>
            <div>
                <img className='w-full rounded-2xl mb-4' src={image} alt="Loading" />
            </div>
            <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
        </div>
    );
}
