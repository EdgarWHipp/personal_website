import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import CV from './components/CV';
import Work from './components/Work';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CV />} />
            <Route path="/work" element={<Work />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 