import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS } from '@utils/regions';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';

type Props = {
  data: BlockbusterData | null;
  loading: boolean;
  getColorForScore: (score: number) => string;
  onSelectState: (code: USAStateAbbreviation) => void;
  selectedState: USAStateAbbreviation | null;
};

export const NationalMapView: React.FC<Props> = ({
  data,
  loading,
  selectedState,
  onSelectState,
  getColorForScore,
}) => {
  const customStates = useMemo(() => {
    const cs: { [key: string]: any } = {};

    if (!data) {
      // Loading state: return states with grey fill but yellow borders
      Object.entries(CENSUS_DIVISIONS)
        .flatMap(([_, states]) => states)
        .forEach((stateCode) => {
          cs[stateCode] = {
            fill: '#6B7280', // lighter grey
            stroke: '#f4dd32', // yellow border
            strokeWidth: 1,
            onClick: () => onSelectState(stateCode as USAStateAbbreviation),
          };
        });
      return cs;
    }

    // State mode: color states based on their scores
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
