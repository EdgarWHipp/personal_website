import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./components/Info";
import Pomodoro from "./components/Pomodoro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/*" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
