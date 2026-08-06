import React, { useMemo } from 'react';
import { Badge, GradientLegend } from '@components/Charts';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import { NationalMapView } from './NationalMapView';

interface NationalHeatMapProps {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  loading: boolean;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onViewStats: () => void;
  selectedState: USAStateAbbreviation | null;
}

export const NationalHeatMap: React.FC<NationalHeatMapProps> = ({
  data,
  getColorForScore,
  getStateRank,
  loading,
  onSelectState,
  onViewStats,
  selectedState,
}) => {
  const badgeData = useMemo(() => {
    if (!selectedState || !data || loading) return null;
    const stateData = data.states[selectedState];
    if (!stateData) return null;
    return {
      type: 'state' as const,
      stateCode: selectedState,
      score: stateData.score,
      rank: getStateRank(selectedState),
    };
  }, [data, getStateRank, loading, selectedState]);

  return (
    <div className="relative w-full">
      <GradientLegend loading={loading} />
      <NationalMapView
        data={data}
        selectedState={selectedState}
        getColorForScore={getColorForScore}
        loading={loading}
        onSelectState={onSelectState}
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

export default NationalHeatMap;
