import React, { useMemo } from 'react';
import { BlockbusterData } from '@types';
import { CENSUS_DIVISIONS } from '@constants';
import { USAMap } from '@components/USAMap';
import { USAStateAbbreviation } from '@constants';
import { useBlockbusterData } from '@providers/BlockbusterDataProvider';

type Props = {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  onSelectRegion: (regionName: string) => void;
  onSelectState: (code: USAStateAbbreviation) => void;
  selectedRegion: string | null;
  selectedState: USAStateAbbreviation | null;
};

export const RegionalMapView: React.FC<Props> = ({
  data,
  getColorForScore,
  onSelectRegion,
  onSelectState,
  selectedRegion,
  selectedState,
}) => {
  const { regionAverageByName } = useBlockbusterData();

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

    if (!regionAverageByName) return cs;

    Object.entries(CENSUS_DIVISIONS).forEach(([regionName, states]) => {
      const regionAvg = regionAverageByName[regionName];
      const regionColor = regionAvg ? getColorForScore(regionAvg) : '#374151';
      states.forEach((stateCode) => {
        const isSelected = selectedState === stateCode;
        const isRegionSelected = selectedRegion === regionName;
        cs[stateCode] = {
          fill: isRegionSelected ? '#f4dd32' : regionColor,
          stroke: isRegionSelected ? '#f4dd32' : regionColor,
          strokeWidth: isSelected || isRegionSelected ? 2 : 1,
          onClick: () => {
            onSelectState(stateCode as USAStateAbbreviation);
            if (regionName) {
              onSelectRegion(regionName);
            }
          },
        };
      });
    });

    return cs;
  }, [
    data,
    selectedState,
    onSelectState,
    onSelectRegion,
    getColorForScore,
    selectedRegion,
    regionAverageByName,
  ]);

  return (
    <div className="w-full">
      <USAMap
        customStates={customStates}
        defaultState={{ fill: '#374151', stroke: '#374151' }}
        mapSettings={{ width: '100%' }}
        className="w-full"
      />
    </div>
  );
};
