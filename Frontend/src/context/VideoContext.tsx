import React, { createContext, useState, useContext } from 'react';

interface VideoContextProps {
    srtContent: string;
    styleTitle: string;  
    setSrtContent: React.Dispatch<React.SetStateAction<string>>;
    setStyleTitle: React.Dispatch<React.SetStateAction<string>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [srtContent, setSrtContent] = useState<string>('');
    const [styleTitle, setStyleTitle] = useState<string>('');
    return (
        <VideoContext.Provider value={{ srtContent, setSrtContent, styleTitle, setStyleTitle }}>
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
