import React, { useMemo } from 'react';
import { Badge } from '@components/Charts';
import RegionalBars from './RegionalBars';

interface RegionalBarChartProps {
  getRegionRank: (regionName: string) => number;
  onSelectRegion: (regionName: string) => void;
  onViewStats: () => void;
  selectedRegion: { name: string; avg: number } | null;
}

export const RegionalBarChart: React.FC<RegionalBarChartProps> = ({
  getRegionRank,
  onSelectRegion,
  onViewStats,
  selectedRegion,
}) => {
  const badgeData = useMemo(
    () =>
      selectedRegion
        ? {
            type: 'region' as const,
            name: selectedRegion.name,
            score: selectedRegion.avg,
            rank: getRegionRank(selectedRegion.name),
          }
        : null,
    [getRegionRank, selectedRegion],
  );

  return (
    <div className="relative w-full">
      <RegionalBars
        className="w-full"
        onSelectRegion={(name: string) => onSelectRegion(name)}
      />
      {badgeData && (
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
            className="hidden lg:block absolute top-0 right-0 translate-x-6"
            data={badgeData}
            variant="default"
            onViewStats={onViewStats}
          />
        </>
      )}
    </div>
  );
};

export default RegionalBarChart;
