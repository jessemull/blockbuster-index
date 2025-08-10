import React from 'react';
import RegionalBars from './RegionalBars';
import SmartBadge from '../../BlockbusterIndex/SmartBadge';

interface RegionalBarChartProps {
  selectedRegion: { name: string; avg: number } | null;
  onSelectRegion: (regionName: string) => void;
  getRegionRank: (regionName: string) => number;
  onViewStats: () => void;
}

export const RegionalBarChart: React.FC<RegionalBarChartProps> = ({
  selectedRegion,
  onSelectRegion,
  getRegionRank,
  onViewStats,
}) => {
  const badgeData = selectedRegion
    ? {
        type: 'region' as const,
        name: selectedRegion.name,
        score: selectedRegion.avg,
        rank: getRegionRank(selectedRegion.name),
      }
    : null;

  return (
    <div className="relative w-full">
      <RegionalBars
        className="w-full"
        onSelectRegion={(name: string) => onSelectRegion(name)}
      />

      {/* Mobile badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="mobile"
          vizType="hist"
          onViewStats={onViewStats}
        />
      )}

      {/* Desktop badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="top-right"
          vizType="hist"
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

export default RegionalBarChart;
