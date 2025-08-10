import GradientLegend from '../../BlockbusterIndex/GradientLegend';
import { RegionalMapView } from './RegionalMapView';
import React, { useMemo } from 'react';
import SmartBadge from '../../BlockbusterIndex/SmartBadge';
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
          <SmartBadge
            data={badgeData}
            onViewStats={onViewStats}
            position="mobile"
            vizType="regional"
          />
          <SmartBadge
            data={badgeData}
            onViewStats={onViewStats}
            position="bottom-right"
            vizType="regional"
          />
        </>
      )}
    </div>
  );
};

export default RegionalHeatMap;
