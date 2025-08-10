'use client';

import React from 'react';
import { StateNames, USAStateAbbreviation } from '@constants';

interface StateData {
  rank: number;
  score: number;
  stateCode: USAStateAbbreviation;
  type: 'state';
}

interface RegionData {
  name: string;
  rank: number;
  score: number;
  type: 'region';
}

interface BadgeProps {
  data: StateData | RegionData;
  onViewStats?: () => void;
  variant?: 'default' | 'mobile' | 'compact';
  className?: string;
  showButton?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  data,
  onViewStats,
  variant = 'default',
  className = '',
  showButton = true,
}) => {
  if (!data) return null;

  const getTitle = () => {
    if (data.type === 'state') {
      return StateNames[data.stateCode];
    }
    return data.name;
  };

  const getSizeClasses = () => {
    switch (variant) {
      case 'mobile':
        return 'w-40 text-center';
      case 'compact':
        return 'w-40 text-center';
      default:
        return 'w-48 text-center';
    }
  };

  const getTitleSize = () => {
    switch (variant) {
      case 'mobile':
        return 'text-lg';
      case 'compact':
        return 'text-sm';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className={className}>
      <div className={getSizeClasses()}>
        <div className={`font-medium text-white mb-1 ${getTitleSize()}`}>
          {getTitle()}
        </div>
        <div className="text-[#f4dd32] font-bold text-xl">{data.score}</div>
        <div className="text-xs text-white mt-1">Rank: {data.rank}</div>
        {showButton && onViewStats && (
          <button
            onClick={onViewStats}
            className="inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
            aria-label="View Stats"
          >
            View Stats
          </button>
        )}
      </div>
    </div>
  );
};

export default Badge;
