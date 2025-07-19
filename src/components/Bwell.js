import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AITherapyChat from './AITherapyChat';
import ProgressTracker from './ProgressTracker';
import PrivacyEncryption from './PrivacyEncryption';
import AIModelConfig from './AIModelConfig';
import ResearchPaperManager from './ResearchPaperManager';
import AuthModal from './AuthModal';

import configManager from '../utils/configManager';
// import researchPaperService from '../services/researchPaperService';

export default function Bwell() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [showAIChat, setShowAIChat] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showAIModelConfig, setShowAIModelConfig] = useState(false);
  const [showResearchManager, setShowResearchManager] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [aiConfig, setAiConfig] = useState({
    provider: 'kimi',
    enabled: false,
    apiKey: '',
    model: 'moonshot-v1-32k'
  });
  // const [researchPaperCount, setResearchPaperCount] = useState(0);

  // Load AI configuration and research papers on component mount
  useEffect(() => {
    const loadedConfig = configManager.getAIConfig();
    setAiConfig(loadedConfig);
    
    // Load research paper count
    // const papers = researchPaperService.getAllPapers();
    // setResearchPaperCount(papers.length);
    
    // Debug info for setup verification
    console.log('🔧 Environment Variables Check:', {
      hasApiKey: !!process.env.REACT_APP_MOONSHOT_KEY,
      apiKeyLength: process.env.REACT_APP_MOONSHOT_KEY?.length || 0,
      apiUrl: process.env.REACT_APP_KIMI_API_URL,
              // researchPapers: papers.length,
      loadedConfig: {
        enabled: loadedConfig.enabled,
        provider: loadedConfig.provider,
        hasApiKey: !!loadedConfig.apiKey
      }
    });
    
    if (!process.env.REACT_APP_MOONSHOT_KEY) {
      console.log('ℹ️ Setup Required: Add REACT_APP_MOONSHOT_KEY to your .env file');
    } else {
      console.log('✅ Environment configured! Kimi K2 should be available.');
    }
  }, []);
  
  const handleAIConfigSaved = (newConfig) => {
    setAiConfig(newConfig);
    configManager.saveAIConfig(newConfig);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 py-12 relative">
      {/* Sign In Button - Top Right */}
      <div className="absolute top-8 right-8 z-30">
        {user ? (
          <div className="flex items-center gap-3">
            <img 
              src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=3b82f6&color=fff`}
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

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
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <p className="text-sm text-blue-700 font-medium">
            This project is currently in development • AI therapy prototype available for testing
          </p>
          <div className="flex items-center gap-2">

          </div>
        </div>
      </div>

      {/* Main Bwell Content */}
      <div className="w-full max-w-4xl mx-auto px-8 mt-8">
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
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setShowAIChat(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
                    >
                      Start AI Session →
                    </button>
                    <button
                      onClick={() => setShowProgressTracker(true)}
                      className="text-xs text-green-600 hover:text-green-800 underline transition-colors"
                    >
                      View Progress →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">fluencypunch Learning</h3>
                  <p className="text-sm text-neutral-600">Master cafe conversations with Pimsleur-style audio learning using AI-generated speech for immersive practice</p>
                  <div className="mt-3">
                    <button
                      onClick={() => navigate('/fluencypunch')}
                      className="text-xs text-purple-600 hover:text-purple-800 underline transition-colors"
                    >
                      Start Language Learning →
                    </button>
                  </div>
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

          {/* AI Status Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-purple-800 mb-2">Kimi K2 Active</h4>
            <p className="text-sm text-purple-700">
              Advanced AI therapy assistant powered by Moonshot AI's Kimi K2-Instruct model. 
              <a 
                href="https://huggingface.co/moonshotai/Kimi-K2-Instruct" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-purple-900"
              >
                View model documentation
              </a>
            </p>
          </div>
          
          {/* Authentication Section */}
          <div className="mt-12">
            {loading ? (
              <div className="flex items-center gap-2 text-neutral-500">
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : user ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=3b82f6&color=fff`}
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-green-800">
                        Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-sm text-green-600">
                        Ready for your personal therapy session
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setShowAIChat(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start Today's Session
                  </button>
                  <button
                    onClick={() => setShowProgressTracker(true)}
                    className="bg-white border border-green-300 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Progress
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Sign In to Access Personal Sessions
                </button>
                <p className="text-sm text-neutral-500 mt-2">
                  Secure login with Google or Apple • Your data stays private
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal Components */}
      {showAIModelConfig && (
        <AIModelConfig
          currentConfig={aiConfig}
          onClose={() => setShowAIModelConfig(false)}
          onConfigSaved={handleAIConfigSaved}
        />
      )}
      
      {showAIChat && (
        <AITherapyChat 
          onClose={() => setShowAIChat(false)} 
          aiConfig={aiConfig}
        />
      )}
      
      {showProgressTracker && (
        <ProgressTracker 
          sessionData={{ startTime: new Date(), framework: 'cbt', riskLevel: 'low' }}
          onClose={() => setShowProgressTracker(false)}
        />
      )}
      
      {showPrivacySettings && (
        <PrivacyEncryption
          onClose={() => setShowPrivacySettings(false)}
          onPrivacySettingsUpdate={(settings, consent) => {
            console.log('Privacy settings updated:', settings, consent);
          }}
        />
      )}

      {showResearchManager && (
        <ResearchPaperManager
          onClose={() => {
            setShowResearchManager(false);
            // Refresh research paper count
            // const papers = researchPaperService.getAllPapers();
            // setResearchPaperCount(papers.length);
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            console.log('✅ Authentication successful');
            setShowAuthModal(false);
          }}
        />
      )}

      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
} 