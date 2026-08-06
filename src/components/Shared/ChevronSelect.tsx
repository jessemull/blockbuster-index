import React from 'react';
import { COLORS } from '@constants';

type Option = {
  label: string;
  value: string;
};

type Props = {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  value: string;
};

/**
 * Styled select with a yellow chevron indicator, shared by VizSelector and Rankings.
 */
export const ChevronSelect: React.FC<Props> = ({
  'aria-label': ariaLabel,
  className = '',
  disabled = false,
  id,
  onChange,
  options,
  value,
}) => {
  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <select
        aria-label={ariaLabel}
        className={`appearance-none w-full py-1.5 md:py-2 pl-4 pr-10 rounded-lg focus:outline-none text-sm md:text-base font-mono font-semibold shadow-md transition-colors ${
          disabled
            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
            : 'bg-brand-dark-blue border-brand-yellow text-white cursor-pointer hover:border-yellow-400 focus:ring-2 focus:ring-brand-yellow'
        } border`}
        disabled={disabled}
        id={id}
        style={{ fontVariantNumeric: 'tabular-nums' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(({ label, value: optionValue }) => (
          <option key={optionValue} className="text-black" value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
        <svg
          aria-hidden="true"
          fill="none"
          height="22"
          viewBox="0 0 22 22"
          width="22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10L11 14L15 10"
            stroke={COLORS.YELLOW}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.7"
          />
        </svg>
      </span>
    </div>
  );
};

export default ChevronSelect;
