import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      // Set binary scrolled state
      if (scrollPosition > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Calculate scroll progress percentage (for gradual animations)
      const progress = Math.min(scrollPosition / scrollThreshold, 1);
      setScrollProgress(progress);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(229, 231, 235, 0.5)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span
              className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:scale-105`}
              style={{
                fontSize: `${1.8 + (1 - scrollProgress) * 0.2}rem`,
                transform: `translateY(${scrollProgress * -2}px)`,
                letterSpacing: `${(1 - scrollProgress) * 0.5}px`,
              }}
              onClick={() => handleNavigate("/")}
            >
              WishTogether
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("/signin")}
                  className={`border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300 
                    ${scrolled ? "hover:shadow-md" : ""}
                    hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:-translate-y-0.5`}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("/signup")}
                  className={`border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300 
                    ${scrolled ? "hover:shadow-md" : ""}
                    hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:-translate-y-0.5`}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("/dashboard")}
                  className="mr-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    handleNavigate("/");
                  }}
                  className={`border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300 
                    ${scrolled ? "hover:shadow-md" : ""}
                    hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:-translate-y-0.5`}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 ml-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/95"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3">
          {!isAuthenticated ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleNavigate("/signin")}
                className="w-full border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigate("/signup")}
                className="w-full border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleNavigate("/dashboard")}
                className="w-full text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  handleNavigate("/");
                }}
                className="w-full border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 transition-all duration-300"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Animated progress indicator */}
      <div
        className="h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-150 navbar-progress-bar"
        style={{
          width: scrolled ? `${scrollProgress * 100}%` : "0%",
          opacity: scrolled ? 1 : 0,
        }}
      />
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 200% 0%;
            }
          }
          
          .navbar-progress-bar {
            background-size: 200% 100%;
            animation: ${scrolled ? "shimmer 2s infinite linear" : "none"};
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
