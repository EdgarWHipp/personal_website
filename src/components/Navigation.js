import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase, authService } from '../utils/supabaseClient';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/bwell"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/bwell")
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                Bwell
              </Link>
              <Link
                to="/genlang"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/genlang")
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                GenLang
              </Link>
            </div>
            
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=16a34a&color=fff`}
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          console.log('✅ Authentication successful');
          checkAuth();
        }}
      />
    </>
  );
};

export default Navigation; 
