'use client';

import React from 'react';

interface GradientLegendProps {
  loading?: boolean;
}

export const GradientLegend: React.FC<GradientLegendProps> = ({
  loading = false,
}) => {
  return (
    <div className="mb-8 md:mb-4 md:mt-0 flex flex-col items-center md:items-end">
      <div className="relative flex flex-col items-center">
        <div
          className="w-64 md:w-96 h-4 border border-white rounded"
          style={{
            background: loading
              ? '#6B7280'
              : 'linear-gradient(to right, rgb(200, 220, 255), rgb(5, 10, 65))',
          }}
        ></div>
        <div className="flex justify-between text-xs text-white mt-2 w-64 md:w-96">
          <span>Brick-and-Mortar</span>
          <span>E-commerce</span>
        </div>
      </div>
    </div>
  );
};

export default GradientLegend;
