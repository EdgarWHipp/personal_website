import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./components/Info";
import BasicCursor from "./components/BasicCursor";

function App() {
  return (
    <Router>
      <BasicCursor />
      <Routes>
        <Route path="/*" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
