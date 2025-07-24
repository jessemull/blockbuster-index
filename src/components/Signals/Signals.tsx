import React from 'react';
import Link from 'next/link';

const Signals: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-black to-blue-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-light text-[#f4dd32] mb-6 tracking-wide">
            Signals
          </h1>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            We&apos;re building a comprehensive breakdown of all the signals
            that power the Blockbuster Index. Soon you&apos;ll be able to
            explore individual data points, understand their weights, and see
            how they contribute to each state&apos;s overall score.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] font-medium text-sm md:text-base rounded-lg hover:bg-[#1a1b3a] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <footer className="text-center py-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default Signals;
