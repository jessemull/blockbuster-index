import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS, COLORS, USAStateAbbreviation } from '@constants';
import { BlockbusterData, Props as USAMapProps } from '@types';

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
  const customStates = useMemo((): NonNullable<USAMapProps['customStates']> => {
    const cs: NonNullable<USAMapProps['customStates']> = {};

    if (!data) {
      (
        Object.values(CENSUS_DIVISIONS).flat() as USAStateAbbreviation[]
      ).forEach((stateCode) => {
        cs[stateCode] = {
          fill: COLORS.MAP_GRAY,
          stroke: COLORS.YELLOW,
          onClick: loading ? undefined : () => onSelectState(stateCode),
        };
      });
      return cs;
    }

    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      if (!stateData) return;
      const code = stateCode as USAStateAbbreviation;
      const isSelected = selectedState === code;
      cs[code] = {
        fill: isSelected ? COLORS.YELLOW : getColorForScore(stateData.score),
        stroke: COLORS.YELLOW,
        onClick: loading ? undefined : () => onSelectState(code),
      };
    });

    return cs;
  }, [data, selectedState, onSelectState, getColorForScore, loading]);

  return (
    <div className="w-full">
      <USAMap
        className="w-full"
        customStates={customStates}
        defaultState={{ fill: COLORS.MAP_DEFAULT, stroke: COLORS.YELLOW }}
        mapSettings={{ width: '100%' }}
      />
      {loading && (
        <div className="text-center mt-4">
          <div className="text-gray-500 text-sm">Loading map data...</div>
        </div>
      )}
    </div>
  );
};
