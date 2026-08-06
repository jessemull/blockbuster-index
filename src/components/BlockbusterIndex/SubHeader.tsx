'use client';

import React from 'react';

export const SubHeader: React.FC = () => {
  return (
    <div className="mb-2 md:mb-0">
      <h2 className="text-base md:text-lg font-normal text-white mb-1">
        E-commerce vs. Brick-and-Mortar
      </h2>
      <p className="text-gray-400 text-xs md:text-sm font-light text-center md:text-left mb-3">
        Click or tap a state to view its score.
      </p>
    </div>
  );
};

export default SubHeader;
