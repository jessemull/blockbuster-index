'use client';

import React from 'react';
import { USAStateAbbreviation } from '@constants';
import { BlockbusterData } from '@types';
import {
  NationalHeatMap,
  RegionalHeatMap,
  NationalLollipopChart,
  RegionalBarChart,
} from '@components/Charts';

export type VizType = 'map' | 'hist' | 'lolli' | 'regional';

interface VisualizationRouterProps {
  vizType: VizType;
  data: BlockbusterData | null;
  loading: boolean;
  selectedState: USAStateAbbreviation | null;
  selectedRegion: { name: string; avg: number } | null;
  onSelectState: (stateCode: USAStateAbbreviation) => void;
  onSelectRegion: (regionName: string) => void;
  onViewStats: () => void;
  getStateRank: (stateCode: USAStateAbbreviation) => number;
  getRegionRank: (regionName: string) => number;
  getColorForScore: (score: number) => string;
}

export const VisualizationRouter: React.FC<VisualizationRouterProps> = ({
  vizType,
  data,
  loading,
  selectedState,
  selectedRegion,
  onSelectState,
  onSelectRegion,
  onViewStats,
  getStateRank,
  getRegionRank,
  getColorForScore,
}) => {
  switch (vizType) {
    case 'map':
      return (
        <NationalHeatMap
          data={data}
          loading={loading}
          selectedState={selectedState}
          onSelectState={onSelectState}
          getColorForScore={getColorForScore}
          getStateRank={getStateRank}
          onViewStats={onViewStats}
        />
      );

    case 'regional':
      return (
        <RegionalHeatMap
          data={data}
          selectedState={selectedState}
          selectedRegion={selectedRegion}
          onSelectState={onSelectState}
          onSelectRegion={onSelectRegion}
          getColorForScore={getColorForScore}
          getRegionRank={getRegionRank}
          onViewStats={onViewStats}
        />
      );

    case 'lolli':
      return (
        <NationalLollipopChart
          data={data}
          selectedState={selectedState}
          onSelectState={onSelectState}
          getStateRank={getStateRank}
          onViewStats={onViewStats}
        />
      );

    case 'hist':
      return (
        <RegionalBarChart
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
          getRegionRank={getRegionRank}
          onViewStats={onViewStats}
        />
      );

    default:
      return null;
  }
};

export default VisualizationRouter;
