'use client';

import React from 'react';
import {
  NationalHeatMap,
  NationalLollipopChart,
  RegionalBarChart,
  RegionalHeatMap,
} from '@components/Charts';
import { USAStateAbbreviation, VizType } from '@constants';
import { BlockbusterData } from '@types';

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
          selectedState={selectedState}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
        />
      );
    case 'regional':
      return (
        <RegionalHeatMap
          data={data}
          getColorForScore={getColorForScore}
          getRegionRank={getRegionRank}
          loading={loading}
          selectedRegion={selectedRegion}
          selectedState={selectedState}
          onSelectRegion={onSelectRegion}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
        />
      );
    case 'lolli':
      return (
        <NationalLollipopChart
          data={data}
          getStateRank={getStateRank}
          loading={loading}
          selectedState={selectedState}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
        />
      );
    case 'hist':
      return (
        <RegionalBarChart
          getRegionRank={getRegionRank}
          loading={loading}
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
          onViewStats={onViewStats}
        />
      );
    default:
      return null;
  }
};

export default VisualizationRouter;
