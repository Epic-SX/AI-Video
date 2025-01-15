import React, { useState } from 'react';
import MenuBar from '../components/MenuBar';
import VideoDisplay from '../components/utils/VideoDisplay';
import Clip from '../components/utils/Clip';
import { useVideoContext } from "../context/VideoContext";

export default function Main() {
    const { tokenObj } = useVideoContext(); // Convert SRT content to clipData
    const [clips, setClips] = useState(tokenObj); // Initialize state with tokenObj
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null); // State to track the active clip

    const handleRemoveClip = (indexToRemove: number) => {
        setClips(clips.filter((_, index) => index !== indexToRemove));
        setActiveClipIndex(null); // Reset the active clip index
    };

    return (
        <div className="w-full z-50 h-full font-sans">
            <MenuBar />
            <div className="flex">
                <div className="w-1/6 border-r-[1px] min-h-[calc(100vh-82px)] bg-gray-100 border-gray-200">
                    <div>
                        <VideoDisplay />
                    </div>
                    <div className="mx-2 bg-white pt-2 mt-4 rounded-xl">
                        <div className="border-b-2 pb-4 border-gray-200">
                            <div>
                                <p className="font-bold">クリップ</p>
                            </div>
                            <div className="pt-4 flex pl-3 pr-2 justify-between">
                                <p>ビデオ</p>
                                <p>クリップ 1</p>
                            </div>
                        </div>
                        <div className="flex pl-3 pr-2 justify-between py-4">
                            <p>Rent A Cat</p>
                            <p>クリップ 1-7</p>
                        </div>
                    </div>
                </div>
                <div className="w-5/6 min-h-[calc(100vh-82px)] bg-gray-100 pt-5 flex flex-col items-center gap-4">
                    {clips.map((clip, index) => (
                        <Clip
                            key={index}
                            title={clip.title}
                            content={clip.content}
                            index={index + 1} // Ensure the index is 1-based
                            isActive={activeClipIndex === index} // Pass the active state
                            onClick={() => setActiveClipIndex(index)} // Set the active clip on click
                            onRemove={() => handleRemoveClip(index)} // Pass the remove function
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}