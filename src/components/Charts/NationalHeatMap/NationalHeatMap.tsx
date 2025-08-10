import React from 'react';
import { Badge, GradientLegend } from '@components/Charts';
import { BlockbusterData } from '@types';
import { NationalMapView } from './NationalMapView';
import { USAStateAbbreviation } from '@constants';

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
  const badgeData =
    selectedState && data && !loading
      ? {
          type: 'state' as const,
          stateCode: selectedState,
          score: data.states[selectedState].score,
          rank: getStateRank(selectedState),
        }
      : null;

  return (
    <div className="relative w-full">
      <GradientLegend loading={loading} />
      <NationalMapView
        data={data}
        loading={loading}
        selectedState={selectedState}
        onSelectState={onSelectState}
        getColorForScore={getColorForScore}
      />
      {badgeData && (
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
            className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-20"
            onViewStats={onViewStats}
          />
        </>
      )}
    </div>
  );
};

export default NationalHeatMap;
