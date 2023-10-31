// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VoiceAssistant from './component/VoiceAssistant';
import Documentaion from './pages/Documentaion';




function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VoiceAssistant className="App" />} />
          <Route path="/doc" element={<Documentaion />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
