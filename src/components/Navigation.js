import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 hover:text-primary-600 transition-colors"
            >
              My Portfolio
            </Link>
          </div>
          <div className="flex space-x-8 items-center">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              CV
            </Link>
            <Link
              to="/work"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/work")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Work
            </Link>
            <Link
              to="/software"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/software")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Software
            </Link>
            <div className="ml-6 flex items-center">
              <span className="mr-2 text-xs text-neutral-500 select-none">🌙</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dark}
                  onChange={() => setDark((d) => !d)}
                  className="sr-only peer"
                  aria-label="Toggle dark mode"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-primary-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
              <span className="ml-2 text-xs text-neutral-500 select-none">☀️</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
