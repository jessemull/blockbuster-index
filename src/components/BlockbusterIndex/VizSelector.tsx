'use client';

import React from 'react';

type VizType = 'map' | 'hist' | 'lolli';

type Props = {
  value: VizType;
  onChange: (v: VizType) => void;
};

export const VizSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex justify-center mb-4 md:mb-6">
      <div className="relative w-full max-w-xs">
        <select
          aria-label="Select visualization"
          value={value}
          onChange={(e) => onChange(e.target.value as VizType)}
          className="appearance-none w-full bg-[#181a2b] border border-[#f4dd32] text-white py-1.5 md:py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4dd32] text-sm md:text-base font-mono font-semibold shadow-md transition-colors cursor-pointer hover:border-yellow-400"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <option className="text-black" value="map">
            National Heat Map
          </option>
          <option className="text-black" value="lolli">
            National Lollipop Chart
          </option>
          <option className="text-black" value="hist">
            Regional Bar Chart
          </option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L11 14L15 10"
              stroke="#f4dd32"
              strokeWidth="2.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default VizSelector;
