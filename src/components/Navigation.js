import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const [user] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth removed

  const isActive = (path) => {
    return location.pathname === path;
  };

  const persona = (() => {
    const qs = new URLSearchParams(location.search);
    const fromQuery = qs.get('view'); // e.g., recruiter, student
    return (fromQuery || 'guest').toLowerCase();
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

            {/* Right: Auth removed */}
            <div className="flex items-center" />
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

      {/* Auth modal removed */}
    </>
  );
};

export default Navigation; 
