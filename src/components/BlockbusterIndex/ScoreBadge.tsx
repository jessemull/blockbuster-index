'use client';

import React from 'react';
import { StateNames, USAStateAbbreviation } from '@constants';

type Props = {
  stateCode: USAStateAbbreviation;
  score: number;
  rank: number;
  onViewStats?: () => void;
  className?: string;
};

export const ScoreBadge: React.FC<Props> = ({
  stateCode,
  score,
  rank,
  onViewStats,
  className,
}) => {
  return (
    <div className={className}>
      <div className="w-40 text-center">
        <div className="font-medium text-white mb-1 text-sm">
          {StateNames[stateCode]}
        </div>
        <div className="text-[#f4dd32] font-bold text-xl">{score}</div>
        <div className="text-xs text-white mt-1">Rank: {rank}</div>
        {onViewStats && (
          <button
            onClick={onViewStats}
            className="hidden lg:inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
            aria-label="View Stats"
          >
            View Stats
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreBadge;
