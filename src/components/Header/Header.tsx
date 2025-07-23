'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
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
              <Image
                src="/favicon.png"
                alt="Blockbuster Index"
                width={32}
                height={32}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
