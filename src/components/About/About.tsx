import React from 'react';
import Link from 'next/link';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-black to-blue-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-16 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
            About the Blockbuster Index
          </h1>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            The Blockbuster Index is an AI-powered exploration of how consumer
            buying habits have shifted from traditional brick-and-mortar stores
            to digital purchases across the United States. Inspired by the
            nostalgic decline of video rental stores like Blockbuster, this
            project creates a unique index that scores each state based on
            signals reflecting the balance of online versus in-person purchases.
          </p>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            The website visualizes these scores and trends, providing an
            engaging way to see how retail behaviors vary
            geographically—combining humor, nostalgia, and data-driven insights.
          </p>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            The Blockbuster Index is built using modern web technologies
            including Next.js, AWS Cloud Infrastructure, and OpenAI, and is
            updated daily with new data. All data is sourced from public APIs,
            web scraping, and official government sources.
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

export default About;
