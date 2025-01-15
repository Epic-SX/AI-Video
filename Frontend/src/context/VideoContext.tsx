import React, { createContext, useState, useContext } from 'react';
import { sampleSrtcontent } from '../constants/srtContent';
import { clipsData } from '../constants/clipData';

interface ClipData {
    content: string;
    title: string[];
}

interface VideoContextProps {
    srtContent: string;
    styleTitle: string;
    activeFontFamily: string;
    activeFontSize: number;
    activeFontColor: string;
    isModalOpen: boolean;
    videoLoading: boolean;
    tokenObj: ClipData[];
    setVideoLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setSrtContent: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setStyleTitle: React.Dispatch<React.SetStateAction<string>>;
    setActiveFontFamily: React.Dispatch<React.SetStateAction<string>>;
    setActiveFontSize: React.Dispatch<React.SetStateAction<number>>;
    setActiveFontColor: React.Dispatch<React.SetStateAction<string>>;
    setTokenObj: React.Dispatch<React.SetStateAction<ClipData[]>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [srtContent, setSrtContent] = useState<string>(sampleSrtcontent);
    const [styleTitle, setStyleTitle] = useState<string>('スタイルなしで始める');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [activeFontFamily, setActiveFontFamily] = useState("Open Sans");
    const [activeFontSize, setActiveFontSize] = useState(110); // Default font size
    const [activeFontColor, setActiveFontColor] = useState("#ffffff"); // Default font color
    const [tokenObj, setTokenObj] = useState<ClipData[]>(clipsData);

    return (
        <VideoContext.Provider value={{
            srtContent, setSrtContent, styleTitle, setStyleTitle, isModalOpen, setIsModalOpen,
            videoLoading, setVideoLoading, tokenObj, setTokenObj, activeFontFamily, setActiveFontFamily,
            activeFontSize, setActiveFontSize, activeFontColor, setActiveFontColor
        }}>
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