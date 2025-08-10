'use client';

import React from 'react';
import ScoreBadge from './ScoreBadge';
import { StateNames, USAStateAbbreviation } from '@constants';

type BadgePosition = 'top-right' | 'bottom-right' | 'mobile';

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

interface SmartBadgeProps {
  data: StateData | RegionData;
  onViewStats: () => void;
  position: BadgePosition;
  vizType: 'map' | 'hist' | 'lolli' | 'regional';
}

export const SmartBadge: React.FC<SmartBadgeProps> = ({
  data,
  position,
  onViewStats,
}) => {
  if (!data) return null;

  if (position === 'mobile') {
    if (data.type === 'state') {
      return (
        <div className="lg:hidden block mt-8 mb-8 mx-auto w-40 text-center">
          <div className="font-medium text-white mb-1 text-lg">
            {StateNames[data.stateCode]}
          </div>
          <div className="text-[#f4dd32] font-bold text-xl">{data.score}</div>
          <div className="text-xs text-white mt-1">Rank: {data.rank}</div>
        </div>
      );
    } else {
      return (
        <div className="lg:hidden block mt-8 mb-8 mx-auto text-center">
          <div className="font-medium text-white mb-1 text-lg">{data.name}</div>
          <div className="text-[#f4dd32] font-bold text-xl">{data.score}</div>
          <div className="text-xs text-white mt-1">Rank: {data.rank}</div>
        </div>
      );
    }
  }

  if (position === 'top-right') {
    if (data.type === 'state') {
      return (
        <ScoreBadge
          stateCode={data.stateCode}
          score={data.score}
          rank={data.rank}
          onViewStats={onViewStats}
          className="hidden lg:block absolute top-0 right-0 translate-x-6"
        />
      );
    } else {
      return (
        <div className="hidden lg:block absolute top-0 right-0 translate-x-6">
          <div className="w-48 text-center">
            <div className="font-medium text-white mb-1 text-sm">
              {data.name}
            </div>
            <div className="text-[#f4dd32] font-bold text-xl">{data.score}</div>
            <div className="text-xs text-white mt-1">Rank: {data.rank}</div>
            <button
              onClick={onViewStats}
              className="inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
              aria-label="View Stats"
            >
              View Stats
            </button>
          </div>
        </div>
      );
    }
  }

  if (position === 'bottom-right') {
    if (data.type === 'state') {
      return (
        <ScoreBadge
          stateCode={data.stateCode}
          score={data.score}
          rank={data.rank}
          onViewStats={onViewStats}
          className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-20"
        />
      );
    } else {
      return (
        <div className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-28">
          <div className="w-48 text-center">
            <div className="font-medium text-white mb-1 text-sm">
              {data.name}
            </div>
            <div className="text-[#f4dd32] font-bold text-xl">{data.score}</div>
            <div className="text-xs text-white mt-1">Rank: {data.rank}</div>
            <button
              onClick={onViewStats}
              className="inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
            >
              View Stats
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default SmartBadge;
