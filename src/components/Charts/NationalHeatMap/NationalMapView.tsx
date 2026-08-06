import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS } from '@constants';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';

type Props = {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  loading: boolean;
  onSelectState: (code: USAStateAbbreviation) => void;
  selectedState: USAStateAbbreviation | null;
};

export const NationalMapView: React.FC<Props> = ({
  data,
  getColorForScore,
  loading,
  onSelectState,
  selectedState,
}) => {
  const customStates = useMemo(() => {
    const cs: { [key: string]: any } = {};

    if (!data) {
      Object.entries(CENSUS_DIVISIONS)
        .flatMap(([_, states]) => states)
        .forEach((stateCode) => {
          cs[stateCode] = {
            fill: '#6B7280',
            stroke: '#f4dd32',
            strokeWidth: 1,
            onClick: loading
              ? undefined
              : () => onSelectState(stateCode as USAStateAbbreviation),
          };
        });
      return cs;
    }

    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      if (!stateData) return;
      const isSelected = selectedState === stateCode;
      cs[stateCode] = {
        fill: isSelected ? '#f4dd32' : getColorForScore(stateData.score),
        stroke: '#f4dd32',
        strokeWidth: isSelected ? 2 : 1,
        onClick: loading
          ? undefined
          : () => onSelectState(stateCode as USAStateAbbreviation),
      };
    });

    return cs;
  }, [data, selectedState, onSelectState, getColorForScore, loading]);

  return (
    <div className="w-full">
      <USAMap
        className="w-full"
        defaultState={{ fill: '#374151', stroke: '#f4dd32' }}
        mapSettings={{ width: '100%' }}
        customStates={customStates}
      />
      {loading && (
        <div className="text-center mt-4">
          <div className="text-gray-500 text-sm">Loading map data...</div>
        </div>
      )}
    </div>
  );
};
