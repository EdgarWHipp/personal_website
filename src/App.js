import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FramerLanding from "./components/FramerLanding";
import Landing from "./components/Landing";
import CV from "./components/CV";
import Work from "./components/Work";
import Info from "./components/Info";
import Hobbies from "./components/Hobbies";
import Experience from "./components/Experience";
import Software from "./components/Software";
import BasicCursor from "./components/BasicCursor";
import Impressum from "./components/Impressum";
import Bwell from "./components/Bwell";
import Training from "./components/Training";
import Pricing from "./components/Pricing";

function App() {
  return (
    <Router>
      <BasicCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/knockout-main" element={<FramerLanding />} />
        <Route path="/info" element={<Info />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/software" element={<Software />} />
        <Route path="/bwell" element={<Bwell />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/training" element={<Training />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-white">
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="cv" element={<CV />} />
                  <Route path="work" element={<Work />} />
                  <Route path="cv/bwell" element={<Bwell />} />
                  <Route path="*" element={<Navigate to="/cv" />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 
