import Lollipop from './Lollipop';
import React, { useMemo } from 'react';
import { Badge } from '@components/Charts';
import { BlockbusterData } from '@types';
import { USAStateAbbreviation } from '@constants';

interface NationalLollipopChartProps {
  data: BlockbusterData | null;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onViewStats: () => void;
  selectedState: USAStateAbbreviation | null;
}

export const NationalLollipopChart: React.FC<NationalLollipopChartProps> = ({
  data,
  getStateRank,
  onSelectState,
  onViewStats,
  selectedState,
}) => {
  const scoresByState = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(
      Object.entries(data.states).map(([k, v]) => [k, v.score]),
    );
  }, [data]);

  const badgeData = useMemo(
    () =>
      selectedState && data
        ? {
            type: 'state' as const,
            stateCode: selectedState,
            score: data.states[selectedState].score,
            rank: getStateRank(selectedState),
          }
        : null,
    [data, getStateRank, selectedState],
  );

  return (
    <div className="relative w-full">
      {data && (
        <Lollipop
          scoresByState={scoresByState}
          className="w-full"
          onSelectState={(code: string) =>
            onSelectState(code as USAStateAbbreviation)
          }
        />
      )}
      {badgeData && (
        <>
          <div className="lg:hidden flex justify-center">
            <Badge
              data={badgeData}
              variant="mobile"
              className="block mt-8 mb-8"
              onViewStats={onViewStats}
            />
          </div>
          <Badge
            data={badgeData}
            variant="default"
            className="hidden lg:block absolute top-0 right-0 translate-x-6"
            onViewStats={onViewStats}
          />
        </>
      )}
    </div>
  );
};

export default NationalLollipopChart;
