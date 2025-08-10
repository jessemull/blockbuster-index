import React from 'react';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import Lollipop from './Lollipop';
import { Badge } from '@components/Charts';

interface NationalLollipopChartProps {
  data: BlockbusterData | null;
  selectedState: USAStateAbbreviation | null;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  onViewStats: () => void;
}

export const NationalLollipopChart: React.FC<NationalLollipopChartProps> = ({
  data,
  selectedState,
  onSelectState,
  getStateRank,
  onViewStats,
}) => {
  const badgeData =
    selectedState && data
      ? {
          type: 'state' as const,
          stateCode: selectedState,
          score: data.states[selectedState].score,
          rank: getStateRank(selectedState),
        }
      : null;

  return (
    <div className="relative w-full">
      {data && (
        <Lollipop
          scoresByState={Object.fromEntries(
            Object.entries(data.states).map(([k, v]) => [k, v.score]),
          )}
          className="w-full"
          onSelectState={(code: string) =>
            onSelectState(code as USAStateAbbreviation)
          }
        />
      )}

      {/* Mobile badge */}
      {badgeData && (
        <Badge
          data={badgeData}
          variant="mobile"
          className="lg:hidden block mt-8 mb-8 mx-auto"
          onViewStats={onViewStats}
        />
      )}

      {/* Desktop badge */}
      {badgeData && (
        <Badge
          data={badgeData}
          variant="default"
          className="hidden lg:block absolute top-0 right-0 translate-x-6"
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

export default NationalLollipopChart;
