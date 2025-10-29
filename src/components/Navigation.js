import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase, authService } from '../utils/supabaseClient';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const persona = (() => {
    const qs = new URLSearchParams(location.search);
    const fromQuery = qs.get('view'); // e.g., recruiter, student
    const fromRole = user?.user_metadata?.role;
    return (fromQuery || fromRole || 'guest').toLowerCase();
  })();

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Brand / Menu */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-50 focus:outline-none"
                aria-label="Open main menu"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>

              <span className="hidden md:inline text-sm text-gray-700">Menu</span>
            </div>

            {/* Right: Auth */}
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

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6 py-2">
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
            {persona === 'recruiter' && (
              <Link
                to="/cv"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/cv")
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                CV
              </Link>
            )}
          </div>

          {/* Mobile menu panel */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 py-2 space-y-1">
              <Link
                to="/bwell"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive("/bwell")
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                Bwell
              </Link>
              <Link
                to="/genlang"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive("/genlang")
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                GenLang
              </Link>
              {persona === 'recruiter' && (
                <Link
                  to="/cv"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive("/cv")
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  CV
                </Link>
              )}
            </div>
          )}
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
