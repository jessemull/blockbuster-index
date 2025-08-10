'use client';

import React, { useMemo } from 'react';
import { USAMap } from '../USAMap';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import { useBlockbusterData } from '@providers';
import { CENSUS_DIVISIONS } from '@utils/regions';

type Props = {
  data: BlockbusterData | null;
  loading: boolean;
  getColorForScore: (score: number) => string;
  onSelectState: (code: USAStateAbbreviation) => void;
  selectedState: USAStateAbbreviation | null;
  isRegional: boolean;
  selectedRegion: string | null;
  onSelectRegion: (regionName: string | null) => void;
};

export const MapView: React.FC<Props> = ({
  data,
  loading,
  selectedState,
  onSelectState,
  getColorForScore,
  isRegional,
  selectedRegion,
  onSelectRegion,
}) => {
  const { regionAverageByName } = useBlockbusterData();

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

    if (isRegional && regionAverageByName) {
      // Regional mode: color states by their region's average score
      Object.entries(data.states).forEach(([stateCode, _stateData]) => {
        const regionName = Object.entries(CENSUS_DIVISIONS).find(
          ([_, states]) => states.includes(stateCode),
        )?.[0];

        const regionScore = regionName ? regionAverageByName[regionName] : 0;

        // If a region is selected and this state is in that region, make it yellow
        const isInSelectedRegion =
          selectedRegion && regionName === selectedRegion;

        cs[stateCode] = {
          fill: isInSelectedRegion ? '#f4dd32' : getColorForScore(regionScore),
          stroke: isInSelectedRegion
            ? '#f4dd32'
            : getColorForScore(regionScore),
          strokeWidth: stateCode === selectedState ? 2 : 1,
          onClick: () => {
            if (isRegional) {
              // In regional mode, select the region instead of just the state
              const clickedRegion = Object.entries(CENSUS_DIVISIONS).find(
                ([_, states]) => states.includes(stateCode),
              )?.[0];

              if (clickedRegion) {
                onSelectRegion(clickedRegion);
                onSelectState(stateCode as USAStateAbbreviation);
              }
            } else {
              onSelectState(stateCode as USAStateAbbreviation);
            }
          },
        };
      });
    } else {
      // State mode: color states by their individual scores
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
    }

    return cs;
  }, [
    data,
    selectedState,
    onSelectState,
    getColorForScore,
    isRegional,
    regionAverageByName,
    selectedRegion,
    onSelectRegion,
  ]);

  return (
    <div className="w-full">
      <USAMap
        customStates={customStates}
        defaultState={{ fill: '#374151', stroke: '#4B5563' }}
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

export default MapView;
