import GradientLegend from '../../BlockbusterIndex/GradientLegend';
import MapView from '../../BlockbusterIndex/MapView';
import React, { useMemo } from 'react';
import SmartBadge from '../../BlockbusterIndex/SmartBadge';
import { BlockbusterData } from '@types';
import { USAStateAbbreviation } from '@constants';

interface RegionalHeatMapProps {
  data: BlockbusterData | null;
  loading: boolean;
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
  loading,
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

  if (!data || loading) {
    return (
      <div className="relative w-full">
        <GradientLegend />
        <MapView
          data={null}
          loading={loading}
          getColorForScore={getColorForScore}
          isRegional={true}
          onSelectState={onSelectState}
          selectedRegion={null}
          selectedState={null}
          onSelectRegion={() => {}}
        />
      </div>
    );
  }
  return (
    <div className="relative w-full">
      <GradientLegend />
      <MapView
        data={data}
        loading={loading}
        getColorForScore={getColorForScore}
        isRegional={true}
        onSelectState={onSelectState}
        selectedRegion={selectedRegion?.name || null}
        selectedState={selectedState}
        onSelectRegion={(regionName: string | null) => {
          if (regionName) {
            onSelectRegion(regionName);
          }
        }}
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
