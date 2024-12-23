import React from 'react';
import Main from './pages/Main';
import { VideoProvider } from './context/VideoContext';

function App() {

  return (
    <VideoProvider>
      <Main />
    </VideoProvider>
  );
}

export default App;
