import React, { useMemo } from 'react';
import { Badge } from '@components/Charts';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import Lollipop from './Lollipop';

interface NationalLollipopChartProps {
  data: BlockbusterData | null;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  loading?: boolean;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onViewStats: () => void;
  selectedState: USAStateAbbreviation | null;
}

export const NationalLollipopChart: React.FC<NationalLollipopChartProps> = ({
  data,
  getStateRank,
  loading = false,
  onSelectState,
  onViewStats,
  selectedState,
}) => {
  const scoresByState = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(
      Object.entries(data.states)
        .filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] =>
          Boolean(entry[1]),
        )
        .map(([k, v]) => [k, v.score]),
    );
  }, [data]);

  const badgeData = useMemo(() => {
    if (!selectedState || !data) return null;
    const stateData = data.states[selectedState];
    if (!stateData) return null;
    return {
      type: 'state' as const,
      stateCode: selectedState,
      score: stateData.score,
      rank: getStateRank(selectedState),
    };
  }, [data, getStateRank, selectedState]);

  return (
    <div aria-busy={loading || undefined} className="relative w-full">
      {data && (
        <Lollipop
          className="w-full"
          loading={loading}
          scoresByState={scoresByState}
          onSelectState={(code: string) =>
            onSelectState(code as USAStateAbbreviation)
          }
        />
      )}
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

export default NationalLollipopChart;
