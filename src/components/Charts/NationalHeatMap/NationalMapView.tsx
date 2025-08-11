import React, { useMemo } from 'react';
import { BlockbusterData } from '@types';
import { CENSUS_DIVISIONS } from '@constants';
import { USAMap } from '@components/USAMap';
import { USAStateAbbreviation } from '@constants';

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
            onClick: () => onSelectState(stateCode as USAStateAbbreviation),
          };
        });
      return cs;
    }

    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      const isSelected = selectedState === stateCode;
      cs[stateCode] = {
        fill: getColorForScore(stateData.score),
        stroke: '#f4dd32',
        strokeWidth: isSelected ? 2 : 1,
        onClick: () => onSelectState(stateCode as USAStateAbbreviation),
      };
    });

    return cs;
  }, [data, selectedState, onSelectState, getColorForScore]);

  return (
    <div className="w-full">
      <USAMap
        customStates={customStates}
        defaultState={{ fill: '#374151', stroke: '#f4dd32' }}
        mapSettings={{ width: '100%' }}
        className="w-full"
      />
      {loading && (
        <div className="text-center mt-4">
          <div className="text-gray-500 text-sm">Loading map data...</div>
        </div>
      )}
    </div>
  );
};
