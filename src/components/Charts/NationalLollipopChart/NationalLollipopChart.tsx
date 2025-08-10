import React from 'react';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import Lollipop from './Lollipop';
import SmartBadge from '../../BlockbusterIndex/SmartBadge';

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
      <Lollipop
        scoresByState={Object.fromEntries(
          Object.entries(data.states).map(([k, v]) => [k, v.score]),
        )}
        className="w-full"
        onSelectState={(code: string) =>
          onSelectState(code as USAStateAbbreviation)
        }
      />

      {/* Mobile badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="mobile"
          vizType="lolli"
          onViewStats={onViewStats}
        />
      )}

      {/* Desktop badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="top-right"
          vizType="lolli"
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

export default NationalLollipopChart;
