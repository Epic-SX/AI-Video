import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useVideoContext } from "../context/VideoContext"
import ToggleSwitch from "./utils/ToggleSwitch";
import Spinner from "./utils/Spiner";
import VideoLoading from "./utils/VideoLoading";
import LinearDeterminate from "./utils/Loading";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { PiStarFourFill } from "react-icons/pi";
import { FiRefreshCw } from "react-icons/fi";
import { LuArrowRightFromLine } from "react-icons/lu";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaHeadphones } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import preview from "../assets/image/genimage_preview_picture-D9WhnO-2.png";
import tts from "../assets/image/ic_ttv_option_tts-DWELf0eR.svg";
import image from "../assets/image/ic_ttv_option_image-96eMZhIZ.svg";
import media from "../assets/image/ic_ttv_option_bgm-sf29aAVo.svg"

const Creation = forwardRef((_, ref) => {
    const [inputValue, setInputValue] = useState<{ topic: string }>({ topic: '' });
    const [gptType, setGptType] = useState<string>("gpt_3.5");
    const [arrayTopic, setArryTopic] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [validateScript, setValidateScript] = useState(false);
    const [validateTopic, setValidateTopic] = useState(false);
    const [response, setResponse] = useState<{ script?: string } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false); // Add a state to track confirmation
    const { setSrtContent, styleTitle, setIsModalOpen, videoLoading, setVideoLoading, setTokenObj } = useVideoContext();

    // Handle input changes with proper type annotations
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue({ topic: e.target.value });
    };


    const handleModalConfirm = () => {
        setIsConfirmed(true); // Set confirmation state
        setIsModalVisible(false); // Close the modal

        // Directly trigger the API call or logic for regenerating
        if (inputValue.topic === "") {
            setValidateTopic(true);
        } else {
            triggerApiCall();
        }
    };

    const completeModal = () => {
        if (!response?.script) {
            setValidateScript(true)
        } else {

            setIsCompleteModalVisible(true);
        }
    }

    const handleCompleteModalConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Set confirmation state
        setIsCompleteModalVisible(false); // Close the modal

        // Directly trigger the API call or logic for regenerating
        if (!response?.script) {
            setValidateScript(true)
        } else {
            handleScript();
        }
    };


    const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isConfirmed) {
            // If the user has not confirmed, open the modal
            if (inputValue.topic === "") {
                setValidateTopic(true);
            } else if (response?.script) {
                setIsModalVisible(true);
            } else {
                // Normal script creation flow
                triggerApiCall();
            }
        } else {
            // If confirmed, regenerate the script
            setIsConfirmed(false);
            triggerApiCall();
        }
    };

    const triggerApiCall = () => {
        setSpinner(true);
        setValidateTopic(false);
        const controller = new AbortController();
        setAbortController(controller);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/generate-script`;
        axios
            .post(apiUrl, inputValue, {
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
            })
            .then((res) => {
                setResponse((prev) => ({
                    ...prev,
                    script: res.data,
                }));
                setSpinner(false);
                console.log("Success:", res);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const handleAbort = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null); // Clean up the abort controller
            setSpinner(false); // Update UI to reflect cancellation
            console.log("Request aborted.");
        }
    };

    const handleScript = () => {

        if (!response?.script) {
            setValidateScript(true)
        }
        else {
            setValidateScript(false)
            setVideoLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/generate-video`;
            axios
                .post(apiUrl, response, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {

                    setSrtContent(res.data.srt_content);
                    setTokenObj(res.data.token_obj);
                    setVideoLoading(false);
                    setIsModalOpen(false);
                    console.log('Success:', res);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    }

    const handleTopic = (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/generate-topic`;
        axios
            .post(apiUrl, styleTitle, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log(res.data)
                if (Array.isArray(res.data)) {
                    // If res.data is already an array, directly set it
                    setArryTopic(res.data);
                } else {
                    // If res.data is a string, process it and split into an array
                    const topics = res.data
                        .split(/「|」\s+|、|\n|,/)  // Split the string into an array of lines
                        .map((line: string) =>
                            line.replace(/^\d+\.\s*/, '') // Remove leading numbers followed by a dot and whitespace
                                .replace(/^・/, '') // Remove leading ・
                                .replace(/[「」]/g, '') // Remove 「」 characters
                                .trim() // Trim any whitespace
                        )
                        .filter((line: string) => line); // Filter out any empty lines

                    setArryTopic(topics); // Set the processed array
                    console.log('Success:', topics);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useImperativeHandle(ref, () => ({
        handleScript, handleTopic, completeModal
    }));

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse((prev) => ({
            ...prev,
            script: e.target.value,
        }));
    };

    const handleFocusTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };


    const handleGptTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setGptType(e.target.value);


    return (
        <>
            {videoLoading ?
                <div className="w-full font-sans min-h-[calc(100vh-82px)] flex justify-center pt-48 bg-gray-50">
                    <VideoLoading />
                </div> :
                <div className="w-full font-sans min-h-[calc(100vh-82px)] flex bg-gray-50">
                    <div className="w-5/6  px-10 py-6">
                        {/* Title and Description */}
                        <div className="flex gap-3">
                            <p className="font-bold text-xl">{styleTitle}</p>
                            <p className="text-gray-400">
                                この動画は自信を持って話し、時には質問を投げかけるスタイルです。
                            </p>
                        </div>

                        {/* Theme Input */}
                        <div className="py-2 flex gap-1 items-center">
                            <p className="font-bold">テーマ</p>
                            {validateTopic && <p className="text-[14px] text-[#F8866C] font-bold ">内容を入力してください。</p>}
                        </div>
                        <div className="flex w-full items-center gap-3">
                            <div className="border w-full flex items-center justify-between rounded-md">
                                <input
                                    className="focus:outline-none p-1 w-full my-2 mx-2 border-r-2  border-gray-300"
                                    type="text"
                                    value={inputValue.topic}
                                    onChange={handleInputChange}
                                    placeholder="テーマを入力"
                                    aria-label="テーマ入力"
                                />
                                <select
                                    className="focus:outline-none"
                                    name="gpt_type"
                                    id="gpt_type"
                                    value={gptType}
                                    onChange={handleGptTypeChange}
                                    aria-label="GPTのタイプ選択"
                                >
                                    <option value="gpt_3.5">gpt_3.5</option>
                                    <option value="gpt_4.0">gpt_4.0</option>
                                </select>
                                <HiMiniQuestionMarkCircle className="text-gray-300 text-2xl mr-2" />
                            </div>
                            <div>
                                <button
                                    className="bg-[#24B7D0] p-3 hover:bg-[#2092a7] rounded-md flex justify-center items-center text-white whitespace-nowrap"
                                    aria-label="AIで作文"
                                    onClick={handleCreate}
                                >
                                    <FaWandMagicSparkles className="text-gray-200 text-lg" />
                                    <p>{!response?.script ? "AIで作文" : "書き直す"}</p>
                                </button>
                            </div>
                        </div>

                        {isModalVisible && (
                            <div className="fixed top-0 left-0 w-full h-full">
                                <div className="absolute bg-black opacity-30 w-full h-full" />
                                <div className="absolute bg-white w-[22%] h-4/12 py-4 px-7 rounded-xl top-[35%] left-[40%] ">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[22px] font-bold">確認</p>
                                        <button onClick={() => setIsModalVisible(false)} className="text-[36px] text-gray-300 hover:cursor-pointer">×</button>
                                    </div>
                                    <div className="pt-6 pb-10">
                                        <p>作成した台本が消えて、新しい台本を作成します。よろしいですか？</p>
                                    </div>
                                    <div className="flex justify-center gap-4 pb-6">
                                        <button onClick={handleModalConfirm} className="py-2 px-6 bg-[#24B7D0] text-white rounded-lg hover:bg-[#2092a7]">書き直す</button>
                                        <button onClick={() => setIsModalVisible(false)} className="py-2 px-8 bg-gray-200 text-white rounded-lg hover:bg-gray-300">閉じる</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isCompleteModalVisible && (
                            <div className="fixed top-0 left-0 w-full h-full">
                                <div className="absolute bg-black opacity-30 w-full h-full" />
                                <div className="absolute bg-white w-[22%] h-4/12 py-4 px-7 rounded-xl top-[35%] left-[40%] ">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[22px] font-bold">確認</p>
                                        <button onClick={() => setIsCompleteModalVisible(false)} className="text-[36px] text-gray-300 hover:cursor-pointer">×</button>
                                    </div>
                                    <div className="pt-6 pb-10 flex justify-center">
                                        <p>作成した台本で動画を作りますか？</p>
                                    </div>
                                    <div className="flex justify-center gap-4 pb-6">
                                        <button onClick={handleCompleteModalConfirm} className="py-2 px-12 bg-[#24B7D0] text-white rounded-lg hover:bg-[#2092a7]">完了</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recommended Topics Section */}
                        {styleTitle !== "スタイルなしで始める" &&
                            <div className="pt-4 flex items-center gap-2">
                                {!loading &&
                                    <div className="flex items-center text-[#937FC2] font-bold">
                                        <PiStarFourFill />
                                        <p className="pl-1">おすすめのテーマ</p>
                                    </div>
                                }


                                <div className="w-[80%] h-11 flex items-end gap-2 overflow-x-auto whitespace-nowrap">
                                    {loading ? (
                                        <div className="flex p-2 items-center">
                                            <p>{styleTitle}に適したテーマを検索中です。10~20秒程度お待ちください。</p>
                                            <Spinner />
                                        </div>
                                    ) : (
                                        arrayTopic.map((topic, index) => (
                                            <p
                                                key={index}
                                                className="p-2 border rounded-md inline-block text-sm hover:cursor-pointer"
                                                onClick={() => setInputValue({ topic })}
                                            >
                                                {topic}
                                            </p>
                                        ))
                                    )}
                                </div>
                                {!loading &&
                                    <div>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md flex justify-center gap-2 items-center text-gray-600 whitespace-nowrap"
                                            aria-label="AIで作文"
                                            onClick={handleTopic}
                                        >
                                            <FiRefreshCw className="text-gray-600 text-lg" />
                                            <p>更新</p>
                                        </button>
                                    </div>
                                }

                            </div>
                        }

                        <div className="pt-4 ">
                            <div className="flex items-center gap-1">
                                <p className="font-bold">台本</p>
                                {validateScript && <p className="text-[14px] text-[#F8866C] font-bold ">内容を入力してください。</p>}
                            </div>
                            {spinner ? (
                                <div className=" absolute top-[50%] left-[30%]">
                                    <LinearDeterminate onCancel={handleAbort} />
                                </div>
                            ) : response ? (
                                <div className="border-[1px] mt-4 w-full bg-white rounded-md border-gray-100">
                                    <textarea
                                        ref={textareaRef}
                                        className="focus:outline-none p-3 w-full h-[480px] resize-none"
                                        value={response.script}
                                        onChange={handleScriptChange}
                                    ></textarea>
                                    <button
                                        onClick={handleFocusTextarea}
                                        className="p-2 m-2 rounded-md flex hover:bg-gray-100 border-gray-100 border-[1px] justify-center gap-2 items-center text-gray-600"
                                        aria-label="AIで作文"
                                    >
                                        <LuArrowRightFromLine className="text-gray-600 text-lg" />
                                        <p>続きを書く</p>
                                    </button>
                                </div>
                            ) : (
                                <div className="border-[1px] mt-4 w-full bg-white rounded-md border-gray-100">
                                    <textarea
                                        ref={textareaRef}
                                        className="focus:outline-none p-3 w-full h-[480px] resize-none"
                                    ></textarea>
                                    <button
                                        className="p-2 m-2 rounded-md flex hover:bg-gray-100 border-gray-100 border-[1px] justify-center gap-2 items-center text-gray-600"
                                        aria-label="AIで作文"
                                        onClick={handleFocusTextarea}
                                    >
                                        <LuArrowRightFromLine className="text-gray-600 text-lg" />
                                        <p>続きを書く</p>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/6 border-l-[1px] bg-white border-gray-200 px-5 ">
                        <div className="pt-4 flex-col">
                            <div className="flex items-center">
                                <RiArrowDropDownLine className="text-3xl" />
                                <p className="font-bold">スタイルプレビュー</p>
                            </div>
                            <figure className="flex justify-center">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-[210px] h-32 object-cover rounded-md "
                                />
                            </figure>
                        </div>
                        <div className="pt-4">
                            <p className="font-bold  pb-4">動画要素</p>
                            <div className=" p-4 border-[1px] border-gray-200 rounded-2xl">
                                <div className="border-b-[1px] pb-4 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img src={tts} alt="tts" />
                                            <p>AI音声</p>
                                        </div>
                                        <ToggleSwitch />
                                    </div>
                                    <div className="flex justify-between items-center pt-4 ">
                                        <div className="text-[#24B7D0] text-[13px] pl-4 pt-2">
                                            <p>もち子さん</p>
                                            <p>早く / 普通</p>
                                        </div>
                                        <div className="flex items-center pt-2 text-[14px] gap-2">
                                            <button className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-md">
                                                <FaHeadphones className="text-[14px]" />
                                            </button>
                                            <button className="py-1 px-2 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-md">
                                                変更
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className=" pb-4 border-gray-200">
                                    <div>
                                        <div className="flex justify-between pt-4  items-center">
                                            <div className="flex items-center gap-3">
                                                <img src={image} alt="tts" />
                                                <p>画像&ビデオ</p>
                                            </div>
                                            <ToggleSwitch />
                                        </div>
                                        <div>
                                            <p className="pt-4">AI 画像</p>
                                            <div className=" flex justify-between items-center text-[#24B7D0] text-[13px] pl-4 pt-2">
                                                <p>すべての色 / 写真</p>
                                                <button className="py-1 px-2 text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-md">
                                                    変更
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between pt-4  items-center">
                                            <div className="flex items-center gap-3">
                                                <p className="pl-4">フリービデオ</p>
                                            </div>
                                            <ToggleSwitch />
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <p>画像&ビデオ</p>
                                            <p>×</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
})

export default Creation;