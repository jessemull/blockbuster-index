import React, { useMemo } from 'react';
import { USAMap } from '@components/USAMap';
import { CENSUS_DIVISIONS, COLORS, USAStateAbbreviation } from '@constants';
import { useBlockbusterData } from '@providers/BlockbusterDataProvider';
import { BlockbusterData, Props as USAMapProps } from '@types';

type Props = {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  loading?: boolean;
  onSelectRegion: (regionName: string) => void;
  onSelectState: (code: USAStateAbbreviation) => void;
  selectedRegion: string | null;
  selectedState: USAStateAbbreviation | null;
};

export const RegionalMapView: React.FC<Props> = ({
  data,
  getColorForScore,
  loading = false,
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
          disabled: loading,
          onClick: loading ? undefined : () => onSelectState(stateCode),
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
          disabled: loading,
          onClick: loading
            ? undefined
            : () => {
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
    loading,
  ]);

  return (
    <div aria-busy={loading || undefined} className="w-full">
      <USAMap
        className="w-full"
        customStates={customStates}
        defaultState={{ fill: COLORS.MAP_DEFAULT, stroke: COLORS.MAP_DEFAULT }}
        mapSettings={{ width: '100%' }}
      />
      {loading && (
        <div aria-live="polite" className="text-center mt-4" role="status">
          <div className="text-gray-500 text-sm">Loading map data...</div>
        </div>
      )}
    </div>
  );
};
