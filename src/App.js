import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./components/Info";
import CV from "./components/CV";
import Experience from "./components/Experience";
import Hobbies from "./components/Hobbies";
import Impressum from "./components/Impressum";
import Pomodoro from "./components/Pomodoro";
import Research from "./components/Research";
import ResearchDetail from "./components/ResearchDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Info />} />
        <Route path="/info" element={<Info />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        <Route path="/legal_notice" element={<Impressum />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
      </Routes>
    </Router>
  );
}

export default App;
