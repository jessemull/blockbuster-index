'use client';

import React from 'react';
import { BlockbusterData } from '@types';
import {
  NationalHeatMap,
  NationalLollipopChart,
  RegionalBarChart,
  RegionalHeatMap,
} from '@components/Charts';
import { USAStateAbbreviation } from '@constants';

export type VizType = 'map' | 'hist' | 'lolli' | 'regional';

interface VisualizationRouterProps {
  data: BlockbusterData | null;
  getColorForScore: (score: number) => string;
  getRegionRank: (regionName: string) => number;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  loading: boolean;
  onSelectRegion: (regionName: string) => void;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onViewStats: () => void;
  selectedRegion: { name: string; avg: number } | null;
  selectedState: USAStateAbbreviation | null;
  vizType: VizType;
}

export const VisualizationRouter: React.FC<VisualizationRouterProps> = ({
  data,
  getColorForScore,
  getRegionRank,
  getStateRank,
  loading,
  onSelectRegion,
  onSelectState,
  onViewStats,
  selectedRegion,
  selectedState,
  vizType,
}) => {
  switch (vizType) {
    case 'map':
      return (
        <NationalHeatMap
          data={data}
          getColorForScore={getColorForScore}
          getStateRank={getStateRank}
          loading={loading}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
          selectedState={selectedState}
        />
      );
    case 'regional':
      return (
        <RegionalHeatMap
          data={data}
          getColorForScore={getColorForScore}
          getRegionRank={getRegionRank}
          onSelectRegion={onSelectRegion}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
          selectedRegion={selectedRegion}
          selectedState={selectedState}
        />
      );
    case 'lolli':
      return (
        <NationalLollipopChart
          data={data}
          getStateRank={getStateRank}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
          selectedState={selectedState}
        />
      );
    case 'hist':
      return (
        <RegionalBarChart
          getRegionRank={getRegionRank}
          onSelectRegion={onSelectRegion}
          onViewStats={onViewStats}
          selectedRegion={selectedRegion}
        />
      );
    default:
      return null;
  }
};

export default VisualizationRouter;
