import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { FaUserCircle } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { motion } from "framer-motion";

export default function LinearDeterminate({ onCancel }: { onCancel: () => void }) {
  const [progress, setProgress] = React.useState(0);
  const [showSecondDiv, setShowSecondDiv] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const delay = setTimeout(() => {
      setShowSecondDiv(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="w-[500px]">
      {/* First div */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p className="bg-gray-100 p-3 rounded-lg">
          YouTube Shortsのスクリプトを書いてください。長さは約300文字 で、くだけた非公式の言葉で書いてください。楽しく興味を持たせる ように書いてください。
        </p>
        <FaUserCircle className="text-[72px] text-gray-400" />
      </motion.div>

      {/* Second div */}
      {showSecondDiv && (
        <motion.div
          className="flex items-center gap-2 pt-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <TbBrandOpenai className="text-[32px] text-[#24b7d0]" />
          <div className="p-3 bg-[#E0F8FB] border-[1px] border-[#D2F2F7] rounded-lg">
            <p className="text-[#1D92A6] pb-4 pr-14 rounded-lg">
              台本の作成中です。1分ほどかかる場合があります。
            </p>
            <div className="flex items-center whitespace-nowrap gap-3">
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <button
                onClick={onCancel}
                className="bg-gray-100 p-2 border-[1px] border-gray-200 rounded-lg"
              >
                生成を中止
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
