'use client';

import React from 'react';

type VizType = 'map' | 'hist' | 'lolli' | 'regional';

type Props = {
  value: VizType;
  onChange: (v: VizType) => void;
  disabled?: boolean;
};

export const VizSelector: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative w-full max-w-xs">
        <select
          aria-label="Select visualization"
          value={value}
          onChange={(e) => onChange(e.target.value as VizType)}
          disabled={disabled}
          className={`appearance-none w-full py-1.5 md:py-2 pl-4 pr-10 rounded-lg focus:outline-none text-sm font-mono font-semibold shadow-md transition-colors ${
            disabled
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : 'bg-[#181a2b] border-[#f4dd32] text-white cursor-pointer hover:border-yellow-400'
          } border`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <option className="text-black" value="map">
            National Heat Map
          </option>
          <option className="text-black" value="lolli">
            National Lollipop Chart
          </option>
          <option className="text-black" value="regional">
            Regional Heat Map
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
