'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-6 lg:mb-8">
      <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
        The Blockbuster Index
      </h1>
      <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light">
        An exploration of how consumer buying habits have shifted from
        traditional brick-and-mortar stores to e-commerce across the United
        States. Inspired by the nostalgic decline of video rental stores.
      </p>
    </div>
  );
};

export default Header;
