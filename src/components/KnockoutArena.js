import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function KnockoutArena() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Animated Fire Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-orange-600/10 to-transparent animate-pulse"></div>
      
      {/* Burning Particles Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-orange-500 rounded-full animate-bounce opacity-80"></div>
        <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-red-300 rounded-full animate-ping opacity-40"></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/fluencypunch')}
        className="absolute left-8 top-8 text-white/70 hover:text-white transition-colors z-20 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Knockout
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        
        {/* Arena Title */}
        <div className="mb-12">
          <h1 className="text-8xl md:text-9xl font-black mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent 
                           drop-shadow-2xl transform-gpu will-change-transform
                           hover:scale-105 transition-transform duration-300 ease-out
                           font-extrabold">
              🔥 ARENA 🔥
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-6">
            Survive the Heat. Master the Language.
          </h2>
        </div>

        <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 backdrop-blur-xl rounded-2xl p-8 border border-red-500/50 max-w-2xl">
          <h3 className="text-3xl font-bold text-orange-200 mb-4 flex items-center justify-center gap-3">
            
            Arena Under Construction
            
          </h3>
          <p className="text-lg text-white/80 mb-6">
            The Knockout Arena is being forged in the fires of innovation. Soon, you'll be able to test your language skills against our most challenging real-time system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => navigate('/fluencypunch')}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              ← Back to Training
            </button>
            
            <div className="text-orange-300 font-medium">
              Prepare yourself in the main lessons first 
            </div>
          </div>
        </div>
        
        {/* Arena Description */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-orange-300 mb-6 flex items-center justify-center gap-3">
              
              Welcome to the Knockout Arena
              
            </h3>
            
            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p className="text-xl text-orange-200 font-semibold">
                The ultimate test of your language skills. How long can you survive?
              </p>
              
              
              
              <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-400/30">
                <h4 className="text-xl font-bold text-orange-200 mb-3">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-white/70">
                  <li>Choose your language and difficulty level</li>
                  <li>Listen to the generated sentence</li>
                  <li>Repeat it with perfect pronunciation</li>
                  <li>Get instant accuracy feedback</li>
                  <li>Survive as long as possible without major errors</li>
                  <li>Compete for the highest survival score</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
       

      </div>
    </div>
  );
} 