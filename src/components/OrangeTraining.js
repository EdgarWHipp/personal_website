import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KimiTherapyAPI from '../services/kimiAPI';
import configManager from '../utils/configManager';
import { supabase, authService, lessonArchiveService } from '../utils/supabaseClient';
import AuthModal from './AuthModal';

export default function OrangeTraining() {
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
    loadUserProgress();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { user } = await authService.getUser();
    setUser(user);
  };

  // Load user progress from localStorage
  const loadUserProgress = () => {
    try {
      const savedProgress = localStorage.getItem('fluencypunch_progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
      }
      
      // Load previous lessons
      const savedLessons = localStorage.getItem('fluencypunch_lessons');
      if (savedLessons) {
        const lessons = JSON.parse(savedLessons);
        setPreviousLessons(lessons);
      }
    } catch (error) {
      // Error loading progress
    }
  };

  // Save user progress to localStorage
  const saveUserProgress = (newProgress) => {
    try {
      localStorage.setItem('fluencypunch_progress', JSON.stringify(newProgress));
      setUserProgress(newProgress);
    } catch (error) {
      // Error saving progress
    }
  };

  // Save lesson to previous lessons
  const saveLessonToHistory = (language, lessonContent, difficultyLevel) => {
    try {
      const newLessons = { ...previousLessons };
      const lesson = {
        id: Date.now(),
        content: lessonContent,
        difficulty: difficultyLevel,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      
      // Add to beginning of array and keep only last 10 lessons
      newLessons[language] = [lesson, ...newLessons[language]].slice(0, 10);
      
      localStorage.setItem('fluencypunch_lessons', JSON.stringify(newLessons));
      setPreviousLessons(newLessons);
    } catch (error) {
      // Error saving lesson
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [lessonText, setLessonText] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [lessonArchived, setLessonArchived] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState({
    french: { completedLessons: 0, difficultyLevel: 1 },
    chinese: { completedLessons: 0, difficultyLevel: 1 }
  });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionLanguage, setRevisionLanguage] = useState('');
  const [previousLessons, setPreviousLessons] = useState({
    french: [],
    chinese: []
  });
  const audioRef = useRef(null);

  // Get AI configuration
  const aiConfig = configManager.getAIConfig();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowRevisionModal(false);
        setShowProgressModal(false);
        setShowAuthModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showRevisionModal, showProgressModal, showAuthModal]);

  // Generate complete cafe lesson
  const generateCafeLesson = async () => {
    if (!selectedLanguage) {
      setError('Please select a language first');
      return;
    }

    if (!aiConfig.enabled || !aiConfig.apiKey) {
      setError('Please configure your KIMI K2 API in Bwell settings first');
      return;
    }

    setIsGenerating(true);
    setError('');
    setAudioUrl('');
    setLessonText('');
    resetLessonState();

    try {
      const currentDifficultyLevel = userProgress[selectedLanguage]?.difficultyLevel || 1;
      const completedLessons = userProgress[selectedLanguage]?.completedLessons || 0;
      
      const prompt = getDifficultyAdjustedPrompt(selectedLanguage, currentDifficultyLevel);

      const api = new KimiTherapyAPI(aiConfig.apiKey, aiConfig.apiUrl);
      
      const response = await api.generateLanguageLesson(prompt, 0.7, 500);
      
      if (!response?.success) {
        throw new Error(response?.error || 'KIMI K2 API call failed');
      }
      
      if (!response?.message) {
        throw new Error('No lesson content received from KIMI K2 API');
      }

      const lessonContent = response.message.trim();
      setLessonText(lessonContent);

    } catch (error) {
      setError(`Error generating lesson: ${error.message}`);
    }
    setIsGenerating(false);
  };

  // Mark lesson as completed and increase difficulty
  const completeLessonWithUnderstanding = () => {
    if (!selectedLanguage || !lessonText) return;
    
    const currentProgress = { ...userProgress };
    const langProgress = currentProgress[selectedLanguage];
    const currentDifficultyLevel = langProgress.difficultyLevel || 1;
    
    // Save current lesson to history
    saveLessonToHistory(selectedLanguage, lessonText, currentDifficultyLevel);
    
    // Increment completed lessons
    langProgress.completedLessons += 1;
    
    // Increase difficulty level every 5 completed lessons
    if (langProgress.completedLessons % 5 === 0) {
      langProgress.difficultyLevel = Math.min(langProgress.difficultyLevel + 1, 10);
    }
    
    // Save progress
    saveUserProgress(currentProgress);
    setLessonCompleted(true);
    setShowProgressModal(true);
  };

  const getDifficultyAdjustedPrompt = (language, difficultyLevel) => {
    const basePrompt = `Create an interactive language lesson for a cafe conversation in ${language === 'chinese' ? 'Mandarin Chinese' : 'French'}.

IMPORTANT FORMAT: Use exactly "Speaker 1:" and "Speaker 2:" labels.

Speaker 1 = English instructor giving clear instructions
Speaker 2 = Native ${language === 'chinese' ? 'Chinese' : 'French'} speaker demonstrating pronunciation

CRITICAL RULE: Whenever Speaker 1 mentions any ${language === 'chinese' ? 'Chinese' : 'French'} words or phrases, Speaker 2 must immediately follow with the same words/phrases in proper pronunciation.

The lesson should teach practical cafe phrases using effective learning techniques:
- Clear instruction and demonstration
- Practice exercises with pauses
- Progressive skill building
- Natural conversation flow
- Native speaker pronunciation after every foreign word/phrase mentioned

Difficulty Level ${difficultyLevel}/10:`;

    const difficultyPrompts = {
      1: `BEGINNER (Level 1): Basic greetings and simple requests
- "Hello", "Please", "Thank you"
- "I want coffee"
- "How much?"
- Very simple, 2-3 word phrases only`,

      2: `BEGINNER+ (Level 2): Simple cafe orders
- Coffee types (coffee, tea, water)
- Basic politeness ("excuse me", "please")
- Simple questions ("where is?")
- 3-4 word phrases`,

      3: `ELEMENTARY (Level 3): Extended cafe interaction
- Ordering specific items with details
- Asking for recommendations
- Basic conversation starters
- 4-5 word phrases`,

      4: `ELEMENTARY+ (Level 4): Cafe preferences
- Expressing likes/dislikes
- Asking about ingredients
- Making special requests
- Simple past/future tense`,

      5: `INTERMEDIATE (Level 5): Complex cafe orders
- Describing preferences in detail
- Discussing food allergies
- Making complaints or compliments
- Multiple sentence structures`,

      6: `INTERMEDIATE+ (Level 6): Cafe conversation
- Casual conversation with staff
- Discussing daily routine
- Making plans while at cafe
- Conditional statements`,

      7: `UPPER-INTERMEDIATE (Level 7): Social cafe interactions
- Meeting friends at cafe
- Discussing work/studies
- Expressing opinions about food
- Complex grammar structures`,

      8: `UPPER-INTERMEDIATE+ (Level 8): Cultural cafe discussions
- Talking about local customs
- Discussing current events
- Debating food culture
- Advanced vocabulary`,

      9: `ADVANCED (Level 9): Professional cafe meetings
- Business discussions
- Formal/informal register switching
- Complex negotiations
- Sophisticated expressions`,

      10: `NATIVE-LEVEL (Level 10): Expert cafe fluency
- Idiomatic expressions
- Cultural references
- Humor and wordplay
- Native-like spontaneous conversation`
    };

    return `${basePrompt}

${difficultyPrompts[difficultyLevel] || difficultyPrompts[1]}

Create natural, engaging exchanges that build confidence. Use clear English instructions and authentic ${language === 'chinese' ? 'Chinese' : 'French'}.

EXAMPLE PATTERN:
Speaker 1: Let's learn how to say "coffee" in ${language === 'chinese' ? 'Chinese' : 'French'}.
Speaker 2: coffee (pronounced in ${language === 'chinese' ? 'Chinese' : 'French'})
Speaker 1: Great! Now try ordering: "I would like one coffee, please."
Speaker 2: [Full phrase in ${language === 'chinese' ? 'Chinese' : 'French'}]

Generate EXACTLY 10 exchanges (20 total lines) at difficulty level ${difficultyLevel} following this pattern.

END THE LESSON WITH:
Speaker 1: Excellent work! You've completed today's ${language === 'chinese' ? 'Chinese' : 'French'} cafe lesson. Practice these phrases before your next visit to a cafe.
Speaker 2: [Encouraging phrase in ${language === 'chinese' ? 'Chinese' : 'French'} meaning "Well done!" or "Good job!"]

Begin the lesson now:`;
  };

  // Reset lesson archived state when generating new lesson
  const resetLessonState = () => {
    setLessonArchived(false);
    setLessonCompleted(false);
    setAudioUrl('');
    setLessonText('');
    setError('');
  };

  // Show revision modal for a language
  const showRevisionForLanguage = async (language) => {
    setRevisionLanguage(language);
    setShowRevisionModal(true);
  };

  // Handle audio play/pause
  const toggleAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-yellow-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-300/20 via-transparent to-red-400/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/knockout-main')}
        className="absolute left-8 top-8 text-white/70 hover:text-white transition-colors z-20 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Knockout
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-16">
        
        {/* Training Title */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent 
                           drop-shadow-2xl transform-gpu will-change-transform
                           hover:scale-105 transition-transform duration-300 ease-out
                           font-extrabold">
                AI Training
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-6">
            Master Languages with AI-Powered Lessons
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center gap-3 text-red-300">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Language Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">          
          {/* French Card */}
          <div 
            onClick={() => {
              setSelectedLanguage('french');
              generateCafeLesson();
            }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">French</h3>
              
              {/* Progress Display */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Progress Level {userProgress.french?.difficultyLevel || 1}/10</span>
                  <span>{userProgress.french?.completedLessons || 0} lessons</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((userProgress.french?.difficultyLevel || 1) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {isGenerating && selectedLanguage === 'french' && (
                <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating lesson...
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showRevisionForLanguage('french');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Revise
                </button>
              </div>
            </div>
          </div>

          {/* Chinese Card */}
          <div 
            onClick={() => {
              setSelectedLanguage('chinese');
              generateCafeLesson();
            }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Chinese</h3>
              
              {/* Progress Display */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Progress Level {userProgress.chinese?.difficultyLevel || 1}/10</span>
                  <span>{userProgress.chinese?.completedLessons || 0} lessons</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((userProgress.chinese?.difficultyLevel || 1) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {isGenerating && selectedLanguage === 'chinese' && (
                <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white"
                  >
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating lesson...
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showRevisionForLanguage('chinese');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Revise
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Text Display */}
        {lessonText && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-4xl w-full">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lesson Script
            </h3>
            <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed font-mono">
                {lessonText}
              </pre>
            </div>
          </div>
        )}

        {/* Complete Lesson Button */}
        {lessonText && !lessonCompleted && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="font-medium text-white mb-3">Complete This Lesson</h3>
            <p className="text-sm text-white/80 mb-4">
              Did you understand more than 80% of the {selectedLanguage} content? Mark this lesson as completed to unlock higher difficulty levels!
            </p>
            <div className="flex flex-col gap-3">
              <div className="text-xs text-white/60">
                Current progress: {userProgress[selectedLanguage]?.completedLessons || 0} lessons completed • Level {userProgress[selectedLanguage]?.difficultyLevel || 1}/10
              </div>
              <button
                onClick={completeLessonWithUnderstanding}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                ✅ I understand more than 80%
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-orange-800/90 to-red-800/90 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-orange-200 mb-4">Lesson Completed!</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Congratulations! You've completed another {selectedLanguage} lesson.
                </p>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-orange-300 font-medium mb-2">Your Progress:</div>
                  <div className="text-sm space-y-1">
                    <div>✅ Lessons completed: {userProgress[selectedLanguage]?.completedLessons || 0}</div>
                    <div>📈 Current level: {userProgress[selectedLanguage]?.difficultyLevel || 1}/10</div>
                    {(userProgress[selectedLanguage]?.completedLessons || 0) % 5 === 0 && userProgress[selectedLanguage]?.difficultyLevel > 1 && (
                      <div className="text-yellow-300 font-medium">🎯 Level increased!</div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-800/90 to-orange-800/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-orange-200 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Previous {revisionLanguage === 'french' ? 'French' : 'Chinese'} Lessons
              </h3>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="space-y-4">                {previousLessons[revisionLanguage]?.length > 0 ? (
                  previousLessons[revisionLanguage].map((lesson, index) => (
                    <div key={lesson.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                            Lesson #{previousLessons[revisionLanguage].length - index}
                          </span>
                          <span className="text-white/60 text-sm">{lesson.date}</span>
                          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                            Level {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                          {lesson.content}
                        </pre>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No previous {revisionLanguage} lessons found.</p>
                    <p className="text-sm mt-2">Complete some lessons to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          checkAuth();
        }}
      />
    </div>
  );
}