import React, { useState } from 'react';
import { FaVideo } from "react-icons/fa";
import caption from '../../assets/image/ic_caption-DeaBVPJc.svg';

type SimpleCardProps = {
    title: string[];
    content: string;
    index: number; // Add the index prop
};

const Clip: React.FC<SimpleCardProps> = ({ title, content, index }) => {
    const [isEditing, setIsEditing] = useState(false); // State to track edit mode
    const [editableContent, setEditableContent] = useState(content); // State for content
    const [isActive, setIsActive] = useState(false); // State to track if the component is active

    const handleContentClick = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditableContent(event.target.value); // Update content on input change
    };

    const handleInputBlur = () => {
        setIsEditing(false); // Exit edit mode when input loses focus
    };

    const handleComponentClick = () => {
        setIsActive(true); // Set the component as active
    };

    const handleComponentBlur = () => {
        setIsActive(false); // Remove active state on blur
    };

    return (
        <div
            className={`flex rounded-xl shadow-lg w-2/3 border-2 ${
                isActive ? 'border-[#24b7d0]' : 'border-transparent'
            }`}
            onClick={handleComponentClick}
            onBlur={handleComponentBlur}
            tabIndex={0} // Make the div focusable to capture blur events
        >
            <div className="w-14 rounded-l-xl pt-2 bg-white border-r-[1px]">
                <p className="text-center">{index}</p> {/* Display the index here */}
            </div>
            <div className="w-full">
                <div
                    className={`flex p-2 h-20 rounded-tr-xl items-center bg-white gap-40 border-b-[1px] ${
                        isActive ? 'border-[#24b7d0]' : 'border-gray-200'
                    }`}
                >
                    <div className="flex gap-2">
                        <FaVideo
                            className="w-5 h-5"
                            style={{ color: isActive ? '#24b7d0' : '#6d6d6d' }} // Dynamically set color
                        />
                        <p className="text-[14px]">動画編集</p>
                    </div>
                    <div className="flex flex-wrap">
                        {title.map((word, index) => (
                            <span
                                key={index}
                                className={`px-2 py-1 border rounded-lg text-gray-800 text-sm border-gray-300`}
                                style={{
                                    borderLeftStyle: index === 0 ? 'solid' : 'dotted',
                                    borderRightStyle: index === title.length - 1 ? 'solid' : 'dotted',
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="h-14 bg-gray-50 rounded-br-xl flex gap-2 pl-[20%] items-center">
                    <img src={caption} alt="caption" className="w-6 h-6" />
                    <p className=" rounded-md px-2 py-1 text-[#166E7d] focus:outline-none focus:border-[1px] focus:border-[#166E7d] w-2/3">{content}</p>

                    {/* {isEditing ? (
                        <input
                            type="text"
                            value={content}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            autoFocus
                            className="border rounded-md px-2 py-1 text-[#166E7d] focus:outline-none focus:border-[1px] focus:border-[#166E7d] w-2/3"
                        />
                    ) : (
                        <p
                            className="text-[#166E7d] cursor-pointer"
                            onClick={handleContentClick}
                        >
                            {editableContent}
                        </p>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Clip;
