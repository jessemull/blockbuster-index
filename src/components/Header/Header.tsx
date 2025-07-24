'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="sticky top-0 z-20 bg-[#0f0f2a] backdrop-blur-sm border-b border-[#f4dd32] relative">
      <div className="max-w-6xl py-3 md:py-4 pl-3 md:pl-6">
        <div className="flex items-center relative">
          {/* Mobile Menu Button - Absolutely positioned */}
          <button
            onClick={toggleMenu}
            className="lg:hidden absolute -left-2 md:-left-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo and Title - Truly centered on mobile */}
          <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-start">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/favicon.png"
                alt="Blockbuster Index"
                width={32}
                height={32}
                className="w-6 h-6 md:w-8 md:h-8"
              />
              <span className="text-white font-light text-base md:text-lg tracking-wide">
                Blockbuster Index
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-8">
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
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden min-h-screen absolute top-0 left-0 bg-[#0f0f2a] border-r border-white shadow-lg z-50 min-w-72">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col py-2 px-4">
              <Link
                href="/"
                className="text-white hover:text-blue-300 transition-colors font-light px-4 py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-blue-300 transition-colors font-light px-4 py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/signals"
                className="text-white hover:text-blue-300 transition-colors font-light px-4 py-3"
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
