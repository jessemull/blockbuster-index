'use client';

import { BarChart3, Home, Info, Menu, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

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
          <button
            aria-label="Toggle menu"
            className="lg:hidden absolute md:-left-2 focus:outline-none"
            onClick={toggleMenu}
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </button>
          <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-start">
            <Link
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              href="/"
            >
              <Image
                alt=""
                className="w-6 h-6 md:w-8 md:h-8"
                height={32}
                src="/favicon.png"
                width={32}
              />
              <span className="text-white font-light text-base md:text-lg tracking-wide">
                Blockbuster Index
              </span>
            </Link>
          </div>
          <nav
            aria-label="Desktop navigation"
            className="hidden lg:flex items-center space-x-6 ml-8"
          >
            <Link
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
              href="/signals"
            >
              Signals
            </Link>
            <Link
              className="text-gray-200 hover:text-blue-300 transition-colors font-light"
              href="/rankings"
            >
              Rankings
            </Link>
          </nav>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden min-h-screen absolute top-0 left-0 bg-[#0f0f2a] border-r border-white/30 shadow-lg z-50 min-w-72">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-3">
                <Image
                  alt=""
                  className="w-5 h-5 md:w-6 md:h-6"
                  height={32}
                  src="/favicon.png"
                  width={32}
                />
                <span className="text-white font-light text-sm md:text-base tracking-wide">
                  Blockbuster Index
                </span>
              </div>
              <button
                aria-label="Close menu"
                className="text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col space-y-0"
            >
              <Link
                className="text-white hover:text-blue-300 transition-colors font-light text-sm md:text-base flex items-center space-x-3 py-2.5 md:py-3 px-4 border-t border-b border-white/30"
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span>Home</span>
              </Link>
              <Link
                className="text-white hover:text-blue-300 transition-colors font-light text-sm md:text-base flex items-center space-x-3 py-2.5 md:py-3 px-4 border-b border-white/30"
                href="/about"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-4 h-4 md:w-5 md:h-5" />
                <span>About</span>
              </Link>
              <Link
                className="text-white hover:text-blue-300 transition-colors font-light text-sm md:text-base flex items-center space-x-3 py-2.5 md:py-3 px-4 border-b border-white/30"
                href="/signals"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                <span>Signals</span>
              </Link>
              <Link
                className="text-white hover:text-blue-300 transition-colors font-light text-sm md:text-base flex items-center space-x-3 py-2.5 md:py-3 px-4 border-b border-white/30"
                href="/rankings"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                <span>Rankings</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
