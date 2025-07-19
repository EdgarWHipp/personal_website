import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Fluencypunch() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowGuide(false);
      }
      
      if (showGuide && event.key === 'Enter') {
        setShowGuide(false);
      }
      
      // Arrow key navigation for main cards
      if (!showGuide) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          // Navigate to previous option
          event.preventDefault();
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          // Navigate to next option
          event.preventDefault();
        }
        if (event.key === 'Enter') {
          // Could activate focused card
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showGuide]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-blue-600/5 to-transparent animate-pulse"></div>
      
      {/* Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full animate-bounce opacity-60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        
        {/* Main Title */}
        <div className="mb-16">
          <h1 className="text-8xl md:text-9xl font-black mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent 
                           drop-shadow-2xl transform-gpu will-change-transform
                           hover:scale-105 transition-transform duration-300 ease-out
                           font-extrabold">
              Knockout.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Master languages through immersive conversations. Choose your path: relaxed training or intense competition.
          </p>
        </div>

        {/* Selection Instructions */}
        <div className="mb-8">
          <p className="text-lg text-white/60">
            Select your learning experience
          </p>
        </div>

        {/* Feature Descriptions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          
          {/* Training Card */}
          <div 
            onClick={() => navigate('/training')}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-blue-300 mb-3">Training Mode</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Calm, structured learning with progressive difficulty levels. Perfect for building solid foundations in French and Chinese.
            </p>
          </div>
          
          {/* Guide Card */}
          <div 
            onClick={() => setShowGuide(true)}
            className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-emerald-300 mb-3">User Guide</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Learn about effective practice techniques and how to maximize your language learning progress.
            </p>
          </div>
          
          {/* Arena Card */}
          <div 
            onClick={() => navigate('/knockout-arena')}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-red-300 mb-3">Knockout Arena</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Real-time competitive challenges with voice recognition scoring. Test your skills and survival instincts.
            </p>
          </div>
        </div>

      </div>

      {/* User Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800/90 to-black/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                User Guide
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Interactive Learning Method</h3>
                  <p>Our lessons use proven language learning techniques:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Progressive skill building</li>
                    <li>Practice exercises with immediate feedback</li>
                    <li>Natural conversation progression</li>
                    <li>Essential vocabulary focus</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How to Practice</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Listen to the English instruction</li>
                    <li>Think about your response during the pause</li>
                    <li>Say your answer out loud</li>
                    <li>Listen to the correct pronunciation</li>
                    <li>Repeat for reinforcement</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tips for Success</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Practice consistently (15-30 minutes daily)</li>
                    <li>Focus on pronunciation over perfection</li>
                    <li>Use the pause time to think</li>
                    <li>Track lessons you understand well</li>
                    <li>Review previous lessons periodically</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Navigation</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use arrow keys to navigate in menus</li>
                    <li>Press Enter to select options</li>
                    <li>Press Escape to close modals</li>
                    <li>Click anywhere on cards to activate them</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
