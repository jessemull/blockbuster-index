import React from 'react';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import MapView from '../../BlockbusterIndex/MapView';
import SmartBadge from '../../BlockbusterIndex/SmartBadge';
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
      <MapView
        data={data}
        loading={loading}
        selectedState={selectedState}
        onSelectState={onSelectState}
        getColorForScore={getColorForScore}
        isRegional={false}
        selectedRegion={null}
        onSelectRegion={() => {}}
      />

      {/* Mobile badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="mobile"
          vizType="map"
          onViewStats={onViewStats}
        />
      )}

      {/* Desktop badge */}
      {badgeData && (
        <SmartBadge
          data={badgeData}
          position="bottom-right"
          vizType="map"
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

export default NationalHeatMap;
