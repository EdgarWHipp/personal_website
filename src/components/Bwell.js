import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bwell() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 py-12 relative">
      {/* Back button top left */}
      <button
        onClick={() => navigate('/cv')}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-blue-500 hover:border-blue-500 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      
      {/* Under Construction Banner */}
      <div className="w-full bg-blue-50 border-l-6 border-blue-400 p-4 mb-10">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-sm text-blue-700 font-medium">
            This project is currently in development
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <h1 className="text-5xl font-bold text-neutral-800">Bwell</h1>
            </div>
            
            <p className="text-lg text-neutral-600 mb-8 max-w-md">
              A thoughtful approach to mental wellness, blending technology with genuine human connection for better mental health.
            </p>
            
            <div className="border-b border-dotted border-neutral-300 w-full mb-8"></div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Calendar Integration</h3>
                  <p className="text-sm text-neutral-600">Seamlessly sync your schedule to understand your daily rhythm and identify patterns affecting your wellbeing</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">AI-Guided Sessions</h3>
                  <p className="text-sm text-neutral-600">Personalized one-on-one conversations with intelligent feedback to help you navigate your mental wellness journey</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Mindful Gaming</h3>
                  <p className="text-sm text-neutral-600">Carefully curated mini-games designed to provide gentle mental breaks and moments of joy in your day</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social/Contact Icons */}
          <div className="flex gap-6 mt-12">
            <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">@</span>
            </div>
            <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">M</span>
            </div>
            <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">W</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Visual Element */}
        <div className="relative flex justify-center items-center">
          {/* Abstract geometric shapes */}
          <div className="relative">
            {/* Large background circle */}
            <div className="w-80 h-80 bg-neutral-800 rounded-full relative overflow-hidden">
              {/* Blue accent circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full opacity-80"></div>
              
              {/* Inner content area */}
              <div className="absolute inset-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex flex-col items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white font-bold"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Mental Wellness</p>
                    <p className="text-xs text-neutral-500 mt-1">Thoughtfully Designed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
} 