import { RegionalMapView } from './RegionalMapView';
import React, { useMemo } from 'react';
import { Badge, GradientLegend } from '@components/Charts';
import { BlockbusterData } from '@types';
import { USAStateAbbreviation } from '@constants';

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
        getColorForScore={getColorForScore}
        onSelectState={onSelectState}
        onSelectRegion={onSelectRegion}
        selectedState={selectedState}
        selectedRegion={selectedRegion?.name || null}
      />
      {selectedRegion && (
        <>
          <Badge
            data={badgeData}
            variant="mobile"
            className="lg:hidden block mt-8 mb-8 mx-auto"
            onViewStats={onViewStats}
          />
          <Badge
            data={badgeData}
            variant="default"
            className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-28"
            onViewStats={onViewStats}
          />
        </>
      )}
    </div>
  );
};

export default RegionalHeatMap;
