import React, { createContext, useState, useContext } from 'react';

interface VideoContextProps {
    srtContent: string;
    styleNumber: number | undefined;  
    setSrtContent: React.Dispatch<React.SetStateAction<string>>;
    setStyleNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [srtContent, setSrtContent] = useState<string>('');
    const [styleNumber, setStyleNumber] = useState<number>();
    return (
        <VideoContext.Provider value={{ srtContent, setSrtContent, styleNumber, setStyleNumber }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = (): VideoContextProps => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideoContext must be used within a VideoProvider');
    }
    return context;
};
