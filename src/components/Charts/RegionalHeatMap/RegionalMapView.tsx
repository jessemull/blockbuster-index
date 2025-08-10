import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS } from '@utils/regions';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import { useBlockbusterData } from '@providers/BlockbusterDataProvider';

type Props = {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  onSelectState: (code: USAStateAbbreviation) => void;
  onSelectRegion: (regionName: string) => void;
  selectedState: USAStateAbbreviation | null;
  selectedRegion: string | null;
};

export const RegionalMapView: React.FC<Props> = ({
  data,
  selectedState,
  onSelectState,
  onSelectRegion,
  getColorForScore,
  selectedRegion,
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

    // Regional mode: color states based on their region's average score
    if (!regionAverageByName) return cs;

    Object.entries(CENSUS_DIVISIONS).forEach(([regionName, states]) => {
      const regionAvg = regionAverageByName[regionName];
      const regionColor = regionAvg ? getColorForScore(regionAvg) : '#374151';

      states.forEach((stateCode) => {
        const isSelected = selectedState === stateCode;
        const isRegionSelected = selectedRegion === regionName;

        cs[stateCode] = {
          fill: regionColor,
          stroke: '#f4dd32',
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
        defaultState={{ fill: '#374151', stroke: '#f4dd32' }}
        mapSettings={{ width: '100%' }}
        className="w-full"
      />
    </div>
  );
};
