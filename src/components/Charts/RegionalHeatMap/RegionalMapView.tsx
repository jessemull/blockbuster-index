import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS, COLORS, USAStateAbbreviation } from '@constants';
import { useBlockbusterData } from '@providers/BlockbusterDataProvider';
import { BlockbusterData, Props as USAMapProps } from '@types';

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

  const customStates = useMemo((): NonNullable<USAMapProps['customStates']> => {
    const cs: NonNullable<USAMapProps['customStates']> = {};

    if (!data) {
      (
        Object.values(CENSUS_DIVISIONS).flat() as USAStateAbbreviation[]
      ).forEach((stateCode) => {
        cs[stateCode] = {
          fill: COLORS.MAP_GRAY,
          stroke: COLORS.YELLOW,
          onClick: () => onSelectState(stateCode),
        };
      });
      return cs;
    }

    if (!regionAverageByName) return cs;

    Object.entries(CENSUS_DIVISIONS).forEach(([regionName, states]) => {
      const regionAvg = regionAverageByName[regionName];
      const regionColor = regionAvg
        ? getColorForScore(regionAvg)
        : COLORS.MAP_DEFAULT;
      (states as USAStateAbbreviation[]).forEach((stateCode) => {
        const isSelected = selectedState === stateCode;
        const isRegionSelected = selectedRegion === regionName;
        cs[stateCode] = {
          fill: isSelected || isRegionSelected ? COLORS.YELLOW : regionColor,
          stroke: isRegionSelected || isSelected ? COLORS.YELLOW : regionColor,
          selected: isSelected || isRegionSelected,
          onClick: () => {
            onSelectState(stateCode);
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
        className="w-full"
        customStates={customStates}
        defaultState={{ fill: COLORS.MAP_DEFAULT, stroke: COLORS.MAP_DEFAULT }}
        mapSettings={{ width: '100%' }}
      />
    </div>
  );
};
