import React, { useMemo } from 'react';
import { Badge, GradientLegend } from '@components/Charts';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import { RegionalMapView } from './RegionalMapView';

interface RegionalHeatMapProps {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  getRegionRank: (regionName: string) => number;
  onSelectRegion: (regionName: string) => void;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onViewStats: () => void;
  selectedRegion: { name: string; avg: number } | null;
  selectedState: USAStateAbbreviation | null;
}

export const RegionalHeatMap: React.FC<RegionalHeatMapProps> = ({
  data,
  getColorForScore,
  getRegionRank,
  onSelectRegion,
  onSelectState,
  onViewStats,
  selectedRegion,
  selectedState,
}) => {
  const badgeData = useMemo(
    () => ({
      name: selectedRegion?.name || '',
      rank: getRegionRank(selectedRegion?.name || ''),
      score: selectedRegion?.avg || 0,
      type: 'region' as const,
    }),
    [selectedRegion, getRegionRank],
  );

  return (
    <div className="relative w-full">
      <GradientLegend />
      <RegionalMapView
        data={data}
        selectedState={selectedState}
        getColorForScore={getColorForScore}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
        selectedRegion={selectedRegion?.name || null}
      />
      {selectedRegion && (
        <>
          <div className="lg:hidden flex justify-center">
            <Badge
              className="block mt-8 mb-8"
              data={badgeData}
              variant="mobile"
              onViewStats={onViewStats}
            />
          </div>
          <Badge
            className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-28"
            data={badgeData}
            variant="default"
            onViewStats={onViewStats}
          />
        </>
      )}
    </div>
  );
};

export default RegionalHeatMap;
