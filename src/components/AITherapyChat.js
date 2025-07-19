import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatSessionService } from '../utils/supabaseClient';
import KimiTherapyAPI from '../services/kimiAPI';

export default function AITherapyChat({ onClose, aiConfig }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Load or create today's session
  useEffect(() => {
    if (!user) return;

    const loadSession = async () => {
      setSessionLoading(true);
      try {
        let session = await chatSessionService.getTodaysSession(user.id);
        
        if (!session) {
          // Create new session for today
          session = await chatSessionService.createTodaysSession(user.id);
        }

        if (session) {
          setCurrentSession(session);
          // Load existing messages or start with welcome message
          if (session.messages && session.messages.length > 0) {
            setMessages(session.messages);
          } else {
            const welcomeMessage = {
              id: 1,
              sender: 'ai',
              text: "Hello! I'm Kimi, an AI assistant created by Moonshot AI, specially configured for mental wellness support. I'm here to provide a safe, non-judgmental space for you to explore your thoughts and feelings. How are you doing today?",
              timestamp: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Fallback to local session
        const welcomeMessage = {
          id: 1,
          sender: 'ai',
          text: "Hello! I'm Kimi, an AI assistant created by Moonshot AI, specially configured for mental wellness support. I'm here to provide a safe, non-judgmental space for you to explore your thoughts and feelings. How are you doing today?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      } finally {
        setSessionLoading(false);
      }
    };

    loadSession();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Save user message to session if available
    if (currentSession) {
      try {
        await chatSessionService.updateSessionMessages(currentSession.id, newMessages);
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    try {
      // Check if AI is configured and enabled
      if (aiConfig?.enabled && aiConfig?.apiKey) {
        const kimiAPI = new KimiTherapyAPI(aiConfig.apiKey, aiConfig.apiUrl);
        
        // Check for crisis keywords first
        if (kimiAPI.detectCrisisKeywords(inputText)) {
          const crisisResponse = kimiAPI.getCrisisResponse();
          const aiMessage = {
            id: Date.now() + 1,
            sender: 'ai',
            text: crisisResponse.message,
            timestamp: new Date().toISOString(),
            isCrisis: true
          };
          const finalMessages = [...newMessages, aiMessage];
          setMessages(finalMessages);
          
          // Save crisis response to session
          if (currentSession) {
            try {
              await chatSessionService.updateSessionMessages(currentSession.id, finalMessages);
            } catch (error) {
              console.error('Error saving crisis message:', error);
            }
          }
          
          setIsTyping(false);
          return;
        }

        // Get all messages for context
        const conversationHistory = messages.concat([userMessage]);
        
        // Send to Kimi K2 API
        const response = await kimiAPI.sendMessage(
          conversationHistory, 
          aiConfig.temperature || 0.6, 
          aiConfig.maxTokens || 1000
        );

        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.success ? response.message : response.fallbackMessage,
          timestamp: new Date(),
          error: !response.success ? response.error : null
        };

        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);
        
        // Save AI response to session
        if (currentSession) {
          try {
            await chatSessionService.updateSessionMessages(currentSession.id, finalMessages);
          } catch (error) {
            console.error('Error saving AI message:', error);
          }
        }
      } else {
        // Fallback to demo responses if AI not configured
        const demoResponses = [
          "I hear what you're sharing with me, and I want you to know that your feelings are completely valid. Can you help me understand more about what you're experiencing right now?",
          "Thank you for trusting me with this. It sounds like you're navigating something challenging. What thoughts or emotions are most prominent for you in this moment?",
          "I appreciate your openness in sharing this with me. Sometimes it can be helpful to explore the underlying feelings. What comes up for you when you think about this situation?",
          "What you're describing sounds really difficult, and it makes complete sense that you'd be feeling this way. Have you noticed any patterns in how these feelings show up for you?",
          "I can sense that this is weighing on you. You've shown real courage in reaching out. What kinds of support or coping strategies have felt helpful to you before?"
        ];

        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `[Demo Mode] ${demoResponses[Math.floor(Math.random() * demoResponses.length)]}`,
          timestamp: new Date().toISOString(),
          isDemo: true
        };

        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);
        
        // Save demo response to session
        if (currentSession) {
          try {
            await chatSessionService.updateSessionMessages(currentSession.id, finalMessages);
          } catch (error) {
            console.error('Error saving demo message:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm experiencing some technical difficulties right now. Please remember that if you're in crisis, you can reach out to professional support services: National Suicide Prevention Lifeline (988) or Emergency Services (911).",
        timestamp: new Date().toISOString(),
        error: error.message
      };
      const finalMessages = [...(messages.length > 0 ? messages : []), errorMessage];
      setMessages(finalMessages);
      
      // Save error message to session
      if (currentSession) {
        try {
          await chatSessionService.updateSessionMessages(currentSession.id, finalMessages);
        } catch (error) {
          console.error('Error saving error message:', error);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">AI</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Kimi K2 Therapy Session</h2>
              <p className="text-sm text-gray-500">
                {sessionLoading ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Loading today's session...
                  </span>
                ) : currentSession ? (
                  <span>Today's Session • {new Date(currentSession.session_date).toLocaleDateString()}</span>
                ) : (
                  "Private & Confidential • Powered by Moonshot AI"
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Crisis Warning */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 font-bold">!</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please contact: 
                National Suicide Prevention Lifeline (988) or Emergency Services (911)
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isCrisis 
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : message.error
                    ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                    : message.isDemo
                    ? 'bg-gray-50 border border-gray-200 text-gray-800'
                    : 'bg-purple-50 border border-purple-200 text-gray-800'
                }`}
              >
                {message.sender === 'ai' && !message.sender === 'user' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">
                      {message.isCrisis ? 'Crisis Support' 
                       : message.error ? 'System Message'
                       : message.isDemo ? 'Demo Mode'
                       : 'Kimi K2'}
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {message.error && (
                  <p className="text-xs mt-1 text-yellow-600 font-medium">
                    Technical Details: {message.error}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Kimi K2 - Advanced agentic AI for mental wellness. This is a prototype tool; for crisis situations, please contact professional help immediately. Press Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  );
} 