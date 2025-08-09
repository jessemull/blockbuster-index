'use client';

import React, { useMemo } from 'react';
import { USAMap } from '../USAMap';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';

type Props = {
  data: BlockbusterData;
  selectedState: USAStateAbbreviation | null;
  onSelectState: (code: USAStateAbbreviation) => void;
  getColorForScore: (score: number) => string;
};

export const MapView: React.FC<Props> = ({
  data,
  selectedState,
  onSelectState,
  getColorForScore,
}) => {
  const customStates = useMemo(() => {
    const cs: { [key: string]: any } = {};
    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      cs[stateCode] = {
        fill:
          stateCode === selectedState
            ? '#e6c82e'
            : getColorForScore(stateData.score),
        stroke: '#f4dd32',
        strokeWidth: stateCode === selectedState ? 2 : 1,
        onClick: () => onSelectState(stateCode as USAStateAbbreviation),
      };
    });
    return cs;
  }, [data, selectedState, onSelectState, getColorForScore]);

  return (
    <USAMap
      customStates={customStates}
      defaultState={{ fill: '#374151', stroke: '#4B5563' }}
      mapSettings={{ width: '100%' }}
      className="w-full"
    />
  );
};

export default MapView;
