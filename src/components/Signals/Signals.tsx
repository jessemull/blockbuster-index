import React from 'react';
import Link from 'next/link';
import { Footer, PageBackground } from '@components/Shared';

const signals = [
  {
    name: 'Amazon',
    description:
      'Measures e-commerce adoption and digital retail presence by analyzing Amazon job posting patterns across all U.S. states.',
  },
  {
    name: 'BLS Brick-And-Mortar Retail',
    description:
      'Analyzes brick-and-mortar retail employment trends using BLS QCEW data (1991–2024).',
  },
  {
    name: 'BLS E-commerce',
    description:
      'Measures e-commerce and digital retail employment growth using BLS QCEW data (1991–2024).',
  },
  {
    name: 'Census',
    description:
      'Provides a measure of physical retail market maturity using U.S. Census Bureau data on retail establishments.',
  },
  {
    name: 'Broadband',
    description:
      'Measures the quality and reach of broadband infrastructure, a key enabler of digital commerce.',
  },
  {
    name: 'Walmart',
    description:
      'Tracks traditional retail employment patterns by monitoring Walmart job postings, offering insights into the balance between traditional and digital retail.',
  },
];

const Signals: React.FC = () => {
  return (
    <PageBackground>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-16 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
            Signals
          </h1>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            The Blockbuster Index is calculated using a weighted combination of
            multiple signals, each reflecting a different aspect of the shift
            from physical to digital retail. Data is sourced from public APIs,
            web scraping, and official government sources.
          </p>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4 md:mb-2">
            Most signals use sliding window calculations to smooth out daily
            fluctuations, and scores are normalized by population to ensure fair
            comparisons between states. As more signals are added, the accuracy
            of the index will continue to improve over time.
          </p>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-6 md:mb-4">
            Below are the current signals powering the index. Each one
            represents a unique perspective on how retail is evolving in the
            United States.
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 mb-10">
          {signals.map((signal) => (
            <div
              key={signal.name}
              className="bg-[#181a2b] border border-[#f4dd32] rounded-lg px-6 py-4 max-w-xl w-full shadow-md"
            >
              <div className="text-[#f4dd32] font-semibold text-lg mb-1">
                {signal.name}
              </div>
              <div className="text-white text-sm font-light">
                {signal.description}
              </div>
            </div>
          ))}
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

export default Signals;
