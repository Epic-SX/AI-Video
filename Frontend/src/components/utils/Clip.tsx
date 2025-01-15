import React, { useState } from 'react';
import { FaVideo } from "react-icons/fa";
import caption from '../../assets/image/ic_caption-DeaBVPJc.svg';

type SimpleCardProps = {
    title: string[];
    content: string;
    index: number;
    isActive: boolean;
    onClick: () => void;
    onRemove: () => void;
};

const Clip: React.FC<SimpleCardProps> = ({ title: initialTitle, content, index, isActive, onClick, onRemove }) => {
    const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
    const [title, setTitle] = useState(initialTitle);
    const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredWordIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredWordIndex(null);
    };

    const handleRemoveWord = (index: number) => {
        setTitle(title.filter((_, i) => i !== index));
        setClickedWordIndex(null);
    };

    const handleClickWord = (index: number) => {
        if (clickedWordIndex === index) {
            handleRemoveWord(index);
        } else {
            setClickedWordIndex(index);
        }
    };

    const handleRemoveDiv = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent click event
        onRemove(); // Call the onRemove prop
    };

    return (
        <div
            className={`flex rounded-xl z-10 shadow-lg w-2/3 border-2 ${isActive ? 'border-[#24b7d0]' : 'border-transparent'
                } relative`}
            onClick={onClick}
            tabIndex={0}
        >
            {isActive && (
                <span
                    className="absolute top-[-10px] right-[-10px] w-4 h-4 flex justify-center items-center text-[#27B8D1] border-[1px] border-[#27B8D1] pb-1 rounded-[50%] hover:cursor-pointer"
                    onClick={handleRemoveDiv}
                >
                    x
                </span>
            )}
            <div className="w-14 rounded-l-xl pt-2 bg-white border-r-[1px]">
                <p className="text-center">{index}</p>
            </div>
            <div className="w-full">
                <div
                    className={`flex p-2 h-20 rounded-tr-xl items-center bg-white gap-40 border-b-[1px] ${isActive ? 'border-[#24b7d0]' : 'border-gray-200'
                        }`}
                >
                    <div className="flex gap-2">
                        <FaVideo
                            className="w-5 h-5"
                            style={{ color: isActive ? '#24b7d0' : '#6d6d6d' }}
                        />
                        <p className="text-[14px] whitespace-nowrap">動画編集</p>
                    </div>
                    <div className="flex flex-wrap">
                        {title.map((word, index) => (
                            <div
                                key={index}
                                className={`px-2 py-1 hover:cursor-pointer z-50 hover:bg-gray-100 relative border rounded-lg text-gray-800 text-sm border-gray-300`}
                                style={{
                                    borderLeftStyle: index === 0 ? 'solid' : 'dotted',
                                    borderRightStyle: index === title.length - 1 ? 'solid' : 'dotted',
                                }}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {word}
                                {hoveredWordIndex === index && (
                                    <span
                                        className={`absolute top-[-10px] hover:cursor-pointer right-[-5px] w-4 h-4 flex justify-center items-center ${clickedWordIndex === index ? 'text-[#27B8D1] text-[10px] whitespace-nowrap border-none' : 'text-[#27B8D1] border-[1px] border-[#27B8D1] pb-1 rounded-[50%]'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickWord(index);
                                        }}
                                    >
                                        {clickedWordIndex === index ? '削除' : 'x'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-14 bg-gray-50 rounded-br-xl flex gap-2 pl-[20%] items-center">
                    <img src={caption} alt="caption" className="w-6 h-6" />
                    <p className="rounded-md px-2 py-1 text-[#166E7d] focus:outline-none focus:border-[1px] focus:border-[#166E7d] w-2/3">{content}</p>
                </div>
            </div>
        </div>
    );
};

export default Clip;