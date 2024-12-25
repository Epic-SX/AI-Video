import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useVideoContext } from "../context/VideoContext"
import ToggleSwitch from "./utils/ToggleSwitch";
import Spinner from "./utils/Spiner";
import Loading from "./utils/Loading";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [response, setResponse] = useState<{ script?: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setSrtContent, styleTitle } = useVideoContext();

  // Handle input changes with proper type annotations
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ topic: e.target.value });
  };

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setError(null);
    setSpinner(true);
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/generate-script`;
    axios
      .post(apiUrl, inputValue, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setResponse((prev) => ({
          ...prev,
          script: res.data,
        }));
        setSpinner(false);
        console.log('Success:', res);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleScript = (e: React.MouseEvent<HTMLButtonElement>) => {
    setError(null);
    setSpinner(true);
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/generate-video`;
    axios
      .post(apiUrl, response, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setSrtContent(res.data);
        setSpinner(false);
        console.log('Success:', res);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleTopic = (e: React.MouseEvent<HTMLButtonElement>) => {
    setError(null);
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
    handleScript, handleTopic
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
        <div className="py-2">
          <p className="font-bold">テーマ</p>
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
              <p>AIで作文</p>
            </button>
          </div>
        </div>

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
          <p className="font-bold">台本</p>
          {response ? (
            spinner ? (
              <div className="absolute top-[60%] right-[55%]">
                <Loading />
              </div>
            ) : (
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
            )
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
            <div className="border-b-[1px] pb-4 border-gray-200">
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

            <div className="pt-4 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={media} alt="tts" />
                  <p>BGM</p>
                </div>
                <ToggleSwitch />
              </div>
              <div className="flex justify-between items-center pt-4 ">
                <div className="text-[#24B7D0] text-[13px] pl-4 pt-2">
                  <p>活気のある</p>
                </div>
                <div className="flex items-center pt-2 text-[14px] gap-2">
                  <button className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-md">
                    <FaPlay className="text-[14px]" />
                  </button>
                  <button className="py-1 px-2 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-md">
                    変更
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
})

export default Creation;