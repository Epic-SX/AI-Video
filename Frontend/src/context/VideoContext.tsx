import React, { createContext, useState, useContext } from 'react';

interface VideoContextProps {
    srtContent: string;
    styleTitle: string;
    isModalOpen: boolean  
    setSrtContent: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setStyleTitle: React.Dispatch<React.SetStateAction<string>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [srtContent, setSrtContent] = useState<string>('');
    const [styleTitle, setStyleTitle] = useState<string>('スタイルなしで始める');
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <VideoContext.Provider value={{ srtContent, setSrtContent, styleTitle, setStyleTitle, isModalOpen, setIsModalOpen }}>
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
