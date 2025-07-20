import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KimiTherapyAPI from '../services/kimiAPI';
import configManager from '../utils/configManager';
import { supabase, authService, lessonArchiveService } from '../utils/supabaseClient';
import AuthModal from './AuthModal';

function removePinyinBrackets(text) {
  // Removes anything in brackets that looks like pinyin (letters, numbers, spaces, tone marks)
  return text.replace(/（[a-zA-Z0-9\sāáǎàōóǒòēéěèīíǐìūúǔùüǘǚǜńň]+）/g, '')
             .replace(/\([a-zA-Z0-9\sāáǎàōóǒòēéěèīíǐìūúǔùüǘǚǜńň]+\)/g, '');
}

export default function Training() {
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
    
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
  const [streaks, setStreaks] = useState({ french: 0, chinese: 0 });
  const [lastCompleted, setLastCompleted] = useState({ french: null, chinese: null });

  // Load streaks from localStorage on mount
  useEffect(() => {
    const streakData = localStorage.getItem('fluencypunch_streaks');
    const lastCompletedData = localStorage.getItem('fluencypunch_lastCompleted');
    if (streakData) setStreaks(JSON.parse(streakData));
    if (lastCompletedData) setLastCompleted(JSON.parse(lastCompletedData));
  }, []);

  // Save streaks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fluencypunch_streaks', JSON.stringify(streaks));
    localStorage.setItem('fluencypunch_lastCompleted', JSON.stringify(lastCompleted));
  }, [streaks, lastCompleted]);

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
      
      if (event.key === 'Enter' && (showRevisionModal || showProgressModal || showAuthModal)) {
        // Handle enter key in modals
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showRevisionModal, showProgressModal, showAuthModal]);

  // Process lesson text and separate by speakers for multi-voice generation
  const parseLessonBySpeakers = (rawText) => {
    const lines = rawText.split('\n').filter(line => line.trim());
    const segments = [];
    
    for (let line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Check for Speaker 1 (Narrator/Instructor)
      if (trimmedLine.toLowerCase().includes('speaker 1:')) {
        const text = trimmedLine.replace(/speaker 1:/i, '').trim();
        if (text) {
          segments.push({
            text: text,
            isNarrator: true,
            speaker: 'narrator'
          });
        }
      }
      // Check for Speaker 2 (Native Speaker)
      else if (trimmedLine.toLowerCase().includes('speaker 2:')) {
        const text = trimmedLine.replace(/speaker 2:/i, '').trim();
        if (text) {
          segments.push({
            text: text,
            isNarrator: false,
            speaker: 'native'
          });
        }
      }
      // Handle lines without explicit speaker labels
      else if (trimmedLine.length > 0) {
        // Default to narrator for instructional content
        segments.push({
          text: trimmedLine,
          isNarrator: true,
          speaker: 'narrator'
        });
      }
    }
    
    return segments;
  };

  // Check if current segment is an anticipation question (should have pause after)
  const isAnticipationSegment = (currentSegment, nextSegment) => {
    if (!currentSegment.isNarrator) return false;
    
    const anticipationKeywords = [
      'say:', 'how do you say', 'try saying', 'repeat:', 'now say',
      'can you say', 'practice saying', 'tell me', 'what is'
    ];
    
    const text = currentSegment.text.toLowerCase();
    const hasAnticipationKeyword = anticipationKeywords.some(keyword => text.includes(keyword));
    const nextIsNative = nextSegment && !nextSegment.isNarrator;
    
    return hasAnticipationKeyword && nextIsNative;
  };

  // Generate silence audio blob
  const generateSilence = async (durationSeconds) => {
    const sampleRate = 44100;
    const numChannels = 1;
    const numSamples = sampleRate * durationSeconds;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
    
    // Fill with silence (zeros)
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      channelData.fill(0);
    }
    
    return audioBufferToWavBlob(audioBuffer);
  };

  // Generate audio using ElevenLabs TTS API
  const generateElevenLabsAudio = async (text, voiceId) => {
    const elevenLabsApiKey = configManager.getElevenLabsConfig().apiKey;
    
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured. Please set it in Bwell settings.');
    }

    try {
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      return audioBlob;
      
    } catch (error) {
      console.error('❌ ElevenLabs API error:', error);
      throw error;
    }
  };

  // Concatenate multiple audio blobs into one seamless audio file
  const concatenateAudioSegments = async (audioBlobs, segments) => {
    try {
      if (audioBlobs.length === 1) {
        return audioBlobs[0];
      }
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffers = [];
      
      // Convert all blobs to audio buffers
      for (let i = 0; i < audioBlobs.length; i++) {
        const blob = audioBlobs[i];
        
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
      }
      
      // Calculate total duration
      const totalAudioDuration = audioBuffers.reduce((sum, buffer) => sum + buffer.duration, 0);
      let totalPauseDuration = 0;
      
      for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        const nextSegment = segments[i + 1];
        
        if (isAnticipationSegment(segment, nextSegment)) {
          totalPauseDuration += 3.0;
        } else {
          totalPauseDuration += 0.5;
        }
      }
      
      const totalDuration = totalAudioDuration + totalPauseDuration;
      const sampleRate = audioBuffers[0].sampleRate;
      const numberOfChannels = audioBuffers[0].numberOfChannels;
      
      
      // Create output buffer
      const totalSamples = Math.ceil(totalDuration * sampleRate);
      const outputBuffer = audioContext.createBuffer(numberOfChannels, totalSamples, sampleRate);
      
      let currentOffset = 0;
      
      // Copy audio data with pauses
      for (let i = 0; i < audioBuffers.length; i++) {
        const buffer = audioBuffers[i];
        const segment = segments[i];
        const nextSegment = segments[i + 1];
        
        // Copy audio data
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const inputData = buffer.getChannelData(channel);
          const outputData = outputBuffer.getChannelData(channel);
          
          for (let sample = 0; sample < inputData.length; sample++) {
            if (currentOffset + sample < outputData.length) {
              outputData[currentOffset + sample] = inputData[sample];
            }
          }
        }
        
        currentOffset += buffer.length;
        
        // Add pause after segment
        if (nextSegment) {
          const pauseDuration = isAnticipationSegment(segment, nextSegment) ? 3.0 : 0.5;
          const pauseSamples = Math.floor(pauseDuration * sampleRate);
          currentOffset += pauseSamples;
        }
      }
      
      return audioBufferToWavBlob(outputBuffer);
      
    } catch (error) {
      // Concatenation failed
      
      // Fallback: return the largest blob
      let largestBlob = audioBlobs[0];
      let largestSize = audioBlobs[0].size;
      
      for (let i = 1; i < audioBlobs.length; i++) {
        if (audioBlobs[i].size > largestSize) {
          largestBlob = audioBlobs[i];
          largestSize = audioBlobs[i].size;
        }
      }
      
      return largestBlob;
    }
  };

  // Convert AudioBuffer to WAV Blob
  const audioBufferToWavBlob = (buffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert audio data
    const offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset + (i * numberOfChannels + channel) * 2, sample * 0x7FFF, true);
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  // Validate lesson text structure and content
  const validateLessonText = (lessonText) => {
    const errors = [];
    const warnings = [];
    
    if (!lessonText || typeof lessonText !== 'string') {
      errors.push('Lesson text is empty or invalid');
      return { isValid: false, errors, warnings };
    }
    
    const trimmed = lessonText.trim();
    if (trimmed.length < 50) {
      errors.push('Lesson text too short (minimum 50 characters)');
    }
    
    // Check for proper speaker format
    const hasSpeaker1 = trimmed.includes('Speaker 1:');
    const hasSpeaker2 = trimmed.includes('Speaker 2:');
    
    if (!hasSpeaker1) {
      errors.push('Missing Speaker 1 segments');
    }
    
    if (!hasSpeaker2) {
      errors.push('Missing Speaker 2 segments');
    }
    
    // Check for minimum exchanges
    const speaker1Count = (trimmed.match(/Speaker 1:/g) || []).length;
    const speaker2Count = (trimmed.match(/Speaker 2:/g) || []).length;
    
    if (speaker1Count < 2) {
      warnings.push('Too few Speaker 1 segments (minimum 2 recommended)');
    }
    
    if (speaker2Count < 2) {
      warnings.push('Too few Speaker 2 segments (minimum 2 recommended)');
    }
    
    // Check for Pimsleur-style prompts
    const hasPrompts = /say:|how do you say|try:|repeat:/i.test(trimmed);
    if (!hasPrompts) {
      warnings.push('Missing Pimsleur-style prompts (say:, how do you say, etc.)');
    }
    
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalLength: trimmed.length,
        speaker1Segments: speaker1Count,
        speaker2Segments: speaker2Count,
        hasPrompts
      }
    };
  };

  // Generate multi-speaker audio using ElevenLabs TTS
  const generateMultiSpeakerAudio = async (lessonText) => {
    try {
      // Parse lesson into speaker segments
      const segments = parseLessonBySpeakers(lessonText);
      
      if (segments.length === 0) {
        throw new Error('No speaker segments found in lesson text');
      }
      
      // Generate audio for each segment
      const audioBlobs = [];
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const nextSegment = segments[i + 1];
        
        // Select voice based on speaker
        const voiceId = segment.isNarrator 
          ? 'JBFqnCBsd6RMkjVDRZzb' // George - Distinguished British academic gentleman
          : selectedLanguage === 'chinese' 
            ? 'Xb7hH8MSUJpSbSDYk0k2' // Alice - Chinese voice
            : 'XB0fDUnXU5powFXDhCwa'; // Charlotte - Authentic French lady
        
        try {
          const audioBlob = await generateElevenLabsAudio(segment.text, voiceId);
          audioBlobs.push(audioBlob);
          
          // Add pause after anticipation questions (Pimsleur method)
          if (nextSegment && isAnticipationSegment(segment, nextSegment)) {
            const pauseBlob = await generateSilence(3.0);
            audioBlobs.push(pauseBlob);
          } else if (nextSegment) {
            const pauseBlob = await generateSilence(0.5);
            audioBlobs.push(pauseBlob);
          }
          
          // Small delay to prevent rate limiting
          if (i < segments.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (segmentError) {
          // Failed to generate audio for segment
          // Add silence placeholder for failed segments
          const silenceBlob = await generateSilence(2.0);
          audioBlobs.push(silenceBlob);
        }
      }
      
      // Concatenate all audio segments
      const finalAudio = await concatenateAudioSegments(audioBlobs, segments);
      return finalAudio;
      
    } catch (error) {
      console.error('❌ Multi-speaker audio generation failed:', error);
      throw error;
    }
  };

  // Validate final audio meets quality standards
  const validateFinalAudio = async (audioBlob, segments, language) => {
    try {
      const warnings = [];
      const minExpectedDuration = segments.length * 1.5; // Minimum 1.5s per segment
      
      // Create audio element to check duration
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
        audio.load();
      });
      
      
      if (audio.duration < minExpectedDuration) {
        warnings.push(`Audio too short: ${audio.duration}s (expected min: ${minExpectedDuration}s)`);
      }
      
      if (audioBlob.size < 10000) { // Less than 10KB
        warnings.push(`Audio file very small: ${audioBlob.size} bytes`);
      }
      
      URL.revokeObjectURL(audioUrl);
      
      return {
        isValid: warnings.length === 0,
        warnings,
        stats: {
          duration: audio.duration,
          fileSize: audioBlob.size,
          expectedDuration: minExpectedDuration
        }
      };
      
    } catch (error) {
      return {
        isValid: false,
        warnings: [`Validation failed: ${error.message}`],
        stats: null
      };
    }
  };

  // Generate complete cafe lesson
  const generateCafeLesson = async (lang) => {
    const languageToUse = lang || selectedLanguage;
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
      const currentDifficultyLevel = userProgress[languageToUse]?.difficultyLevel || 1;
      const completedLessons = userProgress[languageToUse]?.completedLessons || 0;
      
      
      const prompt = getDifficultyAdjustedPrompt(languageToUse, currentDifficultyLevel);
      console.log('DEBUG: Language selected:', languageToUse);
      console.log('DEBUG: Full prompt:', prompt);
      console.log('=== DEBUG PROMPT ===');
      console.log('Selected Language:', languageToUse);
      console.log('Is Chinese:', languageToUse === 'chinese');
      console.log('Prompt:', prompt.substring(0, 200) + '...');

      const api = new KimiTherapyAPI(aiConfig.apiKey, aiConfig.apiUrl);
      
      const response = await api.generateLanguageLesson(prompt, 0.7, 500);
      
      if (!response?.success) {
        throw new Error(response?.error || 'KIMI K2 API call failed');
      }
      
      if (!response?.message) {
        throw new Error('No lesson content received from KIMI K2 API');
      }

      const lessonContent = response.message.trim();
      
      
      // Validate lesson content
      const validation = validateLessonText(lessonContent);
      if (!validation.isValid) {
        throw new Error(`Lesson validation failed: ${validation.errors.join(', ')}`);
      }

      let processedLessonContent = lessonContent;
      if (languageToUse === 'chinese') {
        processedLessonContent = removePinyinBrackets(lessonContent);
      }
      setLessonText(processedLessonContent);

      // Generate audio
      let audioBlob;
      
      try {
        audioBlob = await generateMultiSpeakerAudio(processedLessonContent);
      } catch (multiSpeakerError) {
        // Multi-speaker audio failed, trying fallback
        
        // Fallback: generate entire lesson as single audio
        audioBlob = await generateElevenLabsAudio(processedLessonContent, 'JBFqnCBsd6RMkjVDRZzb');
      }
      
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Validate final audio
        const segments = parseLessonBySpeakers(lessonContent);
        const audioValidation = await validateFinalAudio(audioBlob, segments, languageToUse);
        if (!audioValidation.isValid) {
          console.warn('⚠️ Audio validation warnings:', audioValidation.warnings);
        }
        
      }
    } catch (error) {
      setError(`Error generating lesson: ${error.message}`);
    }
    setIsGenerating(false);
  };

  // Archive lesson when user indicates good comprehension
  const archiveLesson = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!lessonText) {
      setError('No lesson to archive. Please generate a lesson first.');
      return;
    }

    setIsArchiving(true);
    setError('');

    try {
      
      const lessonData = {
        language: selectedLanguage,
        scenario: 'cafe',
        script: lessonText,
        duration: '30s',
        wordCount: lessonText.split(' ').length
      };

      const result = await lessonArchiveService.archiveLesson(user.id, lessonData);
      
      if (result.success) {
        setLessonArchived(true);
      } else {
        // Check if it's a table not found error
        if (result.error?.instructions) {
            setError(`Database Setup Required: The lesson archiving table doesn't exist yet. Please contact the administrator or check the browser console for setup instructions.`);
        } else {
          throw new Error(result.error?.message || 'Failed to archive lesson');
        }
      }
    } catch (error) {
      setError(`Error archiving lesson: ${error.message}`);
      // Archive error
    } finally {
      setIsArchiving(false);
    }
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
    
    // Load archived lessons from database if user is logged in
    if (user) {
      try {
        const archivedLessons = await lessonArchiveService.getUserArchivedLessons(user.id, language);
        
        if (archivedLessons && archivedLessons.length > 0) {
          // Merge database lessons with local lessons
          const dbLessons = archivedLessons.map(lesson => ({
            id: lesson.id,
            content: lesson.script,
            difficulty: lesson.difficulty_level || 1,
            timestamp: lesson.archived_at,
            date: new Date(lesson.archived_at).toLocaleDateString(),
            source: 'database'
          }));
          
          // Combine with local lessons and sort by date
          const localLessons = previousLessons[language] || [];
          const allLessons = [...dbLessons, ...localLessons].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          
          // Update the previous lessons state temporarily for the modal
          setPreviousLessons(prev => ({
            ...prev,
            [language]: allLessons
          }));
          
        }
      } catch (error) {
        // Error loading archived lessons
      }
    }
    
    setShowRevisionModal(true);
  };

  // Mark lesson as completed and increase difficulty
  const completeLessonWithUnderstanding = async () => {
    if (!selectedLanguage || !lessonText || !user) return;
    const currentProgress = { ...userProgress };
    const langProgress = currentProgress[selectedLanguage];
    const currentDifficultyLevel = langProgress.difficultyLevel || 1;
    // Insert lesson into Supabase
    const { error } = await supabase.from('archived_lessons').insert([
      {
        user_id: user.id,
        language: selectedLanguage,
        scenario: 'cafe',
        lesson_script: lessonText,
        comprehension_level: '80%+',
        lesson_duration: '30s',
        word_count: lessonText.split(' ').length,
        difficulty_level: currentDifficultyLevel,
      }
    ]);
    if (error) {
      setError('Failed to save lesson to Supabase: ' + error.message);
      return;
    }
    // Refetch lessons to update progress, streaks, and previousLessons
    fetchLessonsFromSupabase(user.id).then(lessons => {
      const { progress, streaks, lastCompleted, previousLessons } = computeProgressAndStreaks(lessons);
      setUserProgress(progress);
      setStreaks(streaks);
      setLastCompleted(lastCompleted);
      setPreviousLessons(previousLessons);
    setLessonCompleted(true);
    setShowProgressModal(true);
    }).catch(console.error);
  };

  const getDifficultyAdjustedPrompt = (language, difficultyLevel) => {
    const isChinese = language === 'chinese';
    const basePrompt = `CREATE ${isChinese ? 'CHINESE' : 'FRENCH'} LESSON ONLY - NO OTHER LANGUAGES ALLOWED

Create a ${isChinese ? 'MANDARIN CHINESE' : 'FRENCH'} cafe conversation lesson at difficulty level ${difficultyLevel}/10.

STRICT FORMAT:
- Speaker 1: English instructor (always in English)
- Speaker 2: ${isChinese ? 'CHINESE NATIVE SPEAKER' : 'FRENCH NATIVE SPEAKER'} (always in ${isChinese ? 'Traditional Chinese' : 'French'})


LEARNING STRUCTURE:
- Progressive vocabulary building
- Practical cafe scenarios
- Clear instruction followed by native pronunciation
- Difficulty level ${difficultyLevel}/10 content`;

    const difficultyPrompts = {
      1: `${isChinese ? 'BEGINNER CHINESE' : 'BEGINNER FRENCH'} (Level 1): Basic greetings and simple requests
- "Hello", "Please", "Thank you"
- "I want ${isChinese ? '茶' : 'coffee'}"
- "How much?"
- Very simple, 2-3 word phrases only`,

      2: `${isChinese ? 'BEGINNER+ CHINESE' : 'BEGINNER+ FRENCH'} (Level 2): Simple cafe orders
- ${isChinese ? '茶類' : 'Coffee types'} (coffee, tea, water)
- Basic politeness ("excuse me", "please")
- Simple questions ("where is?")
- 3-4 word phrases`,

      3: `${isChinese ? 'ELEMENTARY CHINESE' : 'ELEMENTARY FRENCH'} (Level 3): Extended cafe interaction
- Ordering specific items with details
- Asking for recommendations
- Basic conversation starters
- 4-5 word phrases`,

      4: `${isChinese ? 'ELEMENTARY+ CHINESE' : 'ELEMENTARY+ FRENCH'} (Level 4): Cafe preferences
- Expressing likes/dislikes
- Asking about ingredients
- Making special requests
- Simple past/future tense`,

      5: `${isChinese ? 'INTERMEDIATE CHINESE' : 'INTERMEDIATE FRENCH'} (Level 5): Complex cafe orders
- Describing preferences in detail
- Discussing food allergies
- Making complaints or compliments
- Multiple sentence structures`,

      6: `${isChinese ? 'INTERMEDIATE+ CHINESE' : 'INTERMEDIATE+ FRENCH'} (Level 6): Cafe conversation
- Casual conversation with staff
- Discussing daily routine
- Making plans while at cafe
- Conditional statements`,

      7: `${isChinese ? 'UPPER-INTERMEDIATE CHINESE' : 'UPPER-INTERMEDIATE FRENCH'} (Level 7): Social cafe interactions
- Meeting friends at cafe
- Discussing work/studies
- Expressing opinions about food
- Complex grammar structures`,

      8: `${isChinese ? 'UPPER-INTERMEDIATE+ CHINESE' : 'UPPER-INTERMEDIATE+ FRENCH'} (Level 8): Cultural cafe discussions
- Talking about local customs
- Discussing current events
- Debating food culture
- Advanced vocabulary`,

      9: `${isChinese ? 'ADVANCED CHINESE' : 'ADVANCED FRENCH'} (Level 9): Professional cafe meetings
- Business discussions
- Formal/informal register switching
- Complex negotiations
- Sophisticated expressions`,

      10: `${isChinese ? 'NATIVE-LEVEL CHINESE' : 'NATIVE-LEVEL FRENCH'} (Level 10): Expert cafe fluency
- Idiomatic expressions
- Cultural references
- Humor and wordplay
- Native-like spontaneous conversation`
    };

    return `${basePrompt}

${difficultyPrompts[difficultyLevel] || difficultyPrompts[1]}

CREATE ONLY ${isChinese ? 'CHINESE' : 'FRENCH'} CONTENT:
- Use ${isChinese ? 'Traditional Chinese characters' : 'authentic French'} throughout
- ${isChinese ? 'Chinese examples: 茶, 咖啡, 你好, 謝謝, 我想要一杯咖啡' : 'French examples: café, thé, bonjour, merci, je voudrais un café'}
- ${isChinese ? 'Zero French language or culture references' : 'Zero Chinese language or culture references'}

EXAMPLE PATTERN for ${isChinese ? 'CHINESE' : 'FRENCH'}:
Speaker 1: Let's learn how to say "${isChinese ? 'tea' : 'coffee'}" in ${isChinese ? 'Chinese' : 'French'}.
Speaker 2: ${isChinese ? '茶' : 'café'}
Speaker 1: Great! Now try ordering: "I would like one ${isChinese ? 'tea' : 'coffee'}, please."
Speaker 2: ${isChinese ? '我想要一杯茶' : 'Je voudrais un café, s\'il vous plaît.'}

Generate EXACTLY 10 exchanges (20 total lines) focusing SOLELY on ${isChinese ? 'CHINESE' : 'FRENCH'} at difficulty level ${difficultyLevel}.

END THE LESSON WITH:
Speaker 1: Excellent work! You've completed today's ${isChinese ? 'CHINESE' : 'FRENCH'} cafe lesson. Practice these ${isChinese ? 'Chinese' : 'French'} phrases.
Speaker 2: ${isChinese ? '做得好！' : 'Bien joué!'}

START THE ${isChinese ? 'CHINESE' : 'FRENCH'} LESSON NOW:`;
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

  // Remove all localStorage usage for streaks, progress, and lessons.
  // Add Supabase-based session management:

  // Helper to fetch all lessons for the user from Supabase
  const fetchLessonsFromSupabase = async (userId) => {
    const { data, error } = await supabase
      .from('archived_lessons')
      .select('*')
      .eq('user_id', userId)
      .order('archived_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  // Helper to compute progress and streaks from lessons
  const computeProgressAndStreaks = (lessons) => {
    const progress = { french: { completedLessons: 0, difficultyLevel: 1 }, chinese: { completedLessons: 0, difficultyLevel: 1 } };
    const streaks = { french: 0, chinese: 0 };
    const lastCompleted = { french: null, chinese: null };
    const previousLessons = { french: [], chinese: [] };
    const today = new Date().toISOString().slice(0, 10);
    ['french', 'chinese'].forEach((lang) => {
      const langLessons = lessons.filter(l => l.language === lang);
      progress[lang].completedLessons = langLessons.length;
      progress[lang].difficultyLevel = langLessons.length > 0 ? Math.max(...langLessons.map(l => l.difficulty_level || 1)) : 1;
      previousLessons[lang] = langLessons.map(l => ({
        id: l.id,
        content: l.lesson_script,
        difficulty: l.difficulty_level || 1,
        timestamp: l.archived_at,
        date: new Date(l.archived_at).toLocaleDateString(),
        source: 'database',
      }));
      // Streak calculation
      let streak = 0;
      let lastDate = null;
      for (const lesson of langLessons) {
        const lessonDate = lesson.archived_at.slice(0, 10);
        if (!lastDate) {
          lastDate = lessonDate;
          streak = lessonDate === today ? 1 : 0;
        } else {
          const diff = (new Date(lastDate) - new Date(lessonDate)) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak += 1;
            lastDate = lessonDate;
          } else {
            break;
          }
        }
      }
      streaks[lang] = streak;
      lastCompleted[lang] = lastDate;
    });
    return { progress, streaks, lastCompleted, previousLessons };
  };

  // On mount, fetch lessons and set state
  useEffect(() => {
    if (user) {
      fetchLessonsFromSupabase(user.id).then(lessons => {
        const { progress, streaks, lastCompleted, previousLessons } = computeProgressAndStreaks(lessons);
        setUserProgress(progress);
        setStreaks(streaks);
        setLastCompleted(lastCompleted);
        setPreviousLessons(previousLessons);
      }).catch(console.error);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 relative overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-cyan-600/10 to-transparent animate-pulse"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-teal-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-bounce opacity-80"></div>
        <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-40"></div>
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
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent 
                           drop-shadow-2xl transform-gpu will-change-transform
                           hover:scale-105 transition-transform duration-300 ease-out
                           font-extrabold">
                Training. 
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-6">
            Structured Learning Environment
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
              generateCafeLesson('french');
            }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-200 mb-2">French</h3>
             
              
              {/* Progress Display */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-blue-300/70">
                  <span>Progress Level {userProgress.french?.difficultyLevel || 1}/10</span>
                  <span>{userProgress.french?.completedLessons || 0} lessons</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((userProgress.french?.difficultyLevel || 1) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-2 text-sm text-white/80">Streak: {streaks['french']} days</div>
              
              {isGenerating && selectedLanguage === 'french' && (
                <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
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
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
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
              generateCafeLesson('chinese');
            }}
            className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-teal-200 mb-2">Chinese</h3>
              
              
              {/* Progress Display */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-teal-300/70">
                  <span>Progress Level {userProgress.chinese?.difficultyLevel || 1}/10</span>
                  <span>{userProgress.chinese?.completedLessons || 0} lessons</span>
                </div>
                <div className="w-full bg-teal-900/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((userProgress.chinese?.difficultyLevel || 1) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-2 text-sm text-white/80">Streak: {streaks['chinese']} days</div>
              
              {isGenerating && selectedLanguage === 'chinese' && (
                <div className="absolute inset-0 bg-teal-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
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
                    showRevisionForLanguage('chinese');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Revise
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="mt-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="font-medium text-cyan-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.4 6.4L12 10H8V14h4l3.6 3.6c.8.8 2-0.4 2-1.2V4.6c0-0.8-1.2-2-2-1.2L8.4 6.4z" />
              </svg>
              Your {selectedLanguage === 'french' ? 'French' : 'Chinese'} Lesson Audio
            </h3>
            <div className="space-y-4">
              <audio 
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full"
                controls
              />
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio) {
                      isPlaying ? audio.pause() : audio.play();
                    }
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio) {
                      audio.currentTime = 0;
                      audio.play();
                    }
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Text Display */}
        {lessonText && (
          <div className="mt-8 bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-4xl w-full">
            <h3 className="font-medium text-cyan-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lesson Script
            </h3>
            <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                {lessonText}
              </pre>
            </div>
          </div>
        )}

        {/* Complete Lesson Button */}
        {lessonText && audioUrl && !lessonCompleted && (
          <div className="mt-8 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="font-medium text-teal-300 mb-3">Complete This Lesson</h3>
            <p className="text-sm text-teal-200 mb-4">
              Did you understand more than 80% of the {selectedLanguage} content? Mark this lesson as completed to unlock higher difficulty levels!
            </p>
            <div className="flex flex-col gap-3">
              <div className="text-xs text-white/60">
                Current progress: {userProgress[selectedLanguage]?.completedLessons || 0} lessons completed • Level {userProgress[selectedLanguage]?.difficultyLevel || 1}/10
              </div>
              <button
                onClick={completeLessonWithUnderstanding}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                ✅ I understand more than 80%
              </button>
            </div>
          </div>
        )}

        {/* Archive Button (Legacy - for logged in users) */}
        {user && lessonText && audioUrl && !lessonArchived && !lessonCompleted && (
          <div className="mt-8 bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="font-medium text-cyan-300 mb-3">Track Your Progress (Database)</h3>
            <p className="text-sm text-cyan-200 mb-4">
              Archive this lesson to your account database
            </p>
            <button
              onClick={archiveLesson}
              disabled={isArchiving}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isArchiving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Archiving...
                </>
              ) : (
                <>
                  📚 Archive to database
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-teal-800/90 to-cyan-800/90 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-teal-200 mb-4">Lesson Completed!</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Congratulations! You've completed another {selectedLanguage} lesson.
                </p>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-teal-300 font-medium mb-2">Your Progress:</div>
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
                className="mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
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
          <div className="bg-gradient-to-br from-cyan-800/90 to-blue-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-cyan-200 flex items-center gap-2">
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
              <div className="space-y-4">
                {previousLessons[revisionLanguage]?.length > 0 ? (
                  previousLessons[revisionLanguage].map((lesson, index) => (
                    <div key={lesson.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                            Lesson #{previousLessons[revisionLanguage].length - index}
                          </span>
                          <span className="text-white/60 text-sm">{lesson.date}</span>
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                            Level {lesson.difficulty}
                          </span>
                          {lesson.source === 'database' && (
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                              </svg>
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-mono max-h-96 overflow-y-auto">
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
          console.log('✅ Authentication successful');
          checkAuth();
        }}
      />
    </div>
  );
} 