import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function FramerLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);

  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Throttled scroll handler for smoother performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Check current auth state
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      subscription.unsubscribe();
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/orange-training`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-600 to-yellow-500">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-300/20 via-transparent to-red-400/20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/knockout-image.png" 
              alt="Knockout Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <div className="text-white font-bold text-2xl">Knockout</div>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setShowUserGuide(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              User Guide
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </button>
            {user ? (
              <>
                <div className="text-white/80">
                  {user.email}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleGoogleSignIn}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGoogleSignIn}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Unlock fluent, fearless
            <br />
            <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              conversations—fast.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            Experience the future of language learning with immersive AI conversations.
          </p>

          <div className="flex justify-center items-center">
            <button
              onClick={() => navigate('/training')}
              className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Learning
            </button>
          </div>
        </div>

      
      </section>

      
      {/* User Guide Modal */}
      {showUserGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-orange-800/90 to-red-800/90 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-orange-200 flex items-center gap-2">
                User Guide
              </h3>
              <button
                onClick={() => setShowUserGuide(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Audio intro */}
            <div className="mb-6">
              <audio controls style={{ width: '100%' }}>
                <source src="/intro.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            {/* ... your guide content here ... */}
            <button
              onClick={() => setShowUserGuide(false)}
              className="mt-8 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Got it! Start Learning
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/60">
            © 2025 Knockout. Master languages with AI-powered training.
          </p>
        </div>
      </footer>
    </div>
  );
}