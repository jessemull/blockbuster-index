'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0f0f2a] backdrop-blur-sm border-b border-[#f4dd32]">
      <div className="max-w-6xl py-4 pl-6">
        <div className="flex items-center space-x-8">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/favicon.png"
                alt="Blockbuster Index"
                className="w-8 h-8"
              />
              <span className="text-white font-light text-lg tracking-wide">
                Blockbuster Index
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
            >
              About
            </Link>
            <Link
              href="/signals"
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
            >
              Signals
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-200 p-2 hover:bg-white/20 rounded transition-colors ml-auto"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-200 hover:text-blue-300 transition-colors font-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-200 hover:text-blue-300 transition-colors font-light"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/signals"
                className="text-gray-200 hover:text-blue-300 transition-colors font-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Signals
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
