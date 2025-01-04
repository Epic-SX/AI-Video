import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearDeterminate() {
  const [progress, setProgress] = React.useState(0);

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

  return (
    <div>
      <div>
        <p>YouTube Shortsのスクリプトを書いてください。長さは約300文字 で、くだけた非公式の言葉で書いてください。楽しく興味を持たせる ように書いてください。</p>
      </div>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </div>
  );
}