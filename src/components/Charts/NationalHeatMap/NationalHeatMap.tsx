import React from 'react';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import { NationalMapView } from './NationalMapView';
import { Badge } from '@components/BlockbusterIndex';
import GradientLegend from '../../BlockbusterIndex/GradientLegend';

interface NationalHeatMapProps {
  data: BlockbusterData | null;
  loading: boolean;
  selectedState: USAStateAbbreviation | null;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  getColorForScore: (score: number) => string;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  onViewStats: () => void;
}

export const NationalHeatMap: React.FC<NationalHeatMapProps> = ({
  data,
  loading,
  selectedState,
  onSelectState,
  getColorForScore,
  getStateRank,
  onViewStats,
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
      <GradientLegend />
      <NationalMapView
        data={data}
        loading={loading}
        selectedState={selectedState}
        onSelectState={onSelectState}
        getColorForScore={getColorForScore}
      />

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
          className="hidden lg:block absolute bottom-0 right-0 transform -translate-y-40 translate-x-20"
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

export default NationalHeatMap;
