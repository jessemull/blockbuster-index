import React from 'react';
import Link from 'next/link';
import { Footer, PageBackground } from '@components/Shared';

const About: React.FC = () => {
  return (
    <PageBackground>
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
      <Footer />
    </PageBackground>
  );
};

export default About;
