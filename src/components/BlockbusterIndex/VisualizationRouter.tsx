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
          getStateRank={getStateRank}
          selectedState={selectedState}
          getColorForScore={getColorForScore}
          loading={loading}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
        />
      );
    case 'regional':
      return (
        <RegionalHeatMap
          data={data}
          selectedState={selectedState}
          getColorForScore={getColorForScore}
          getRegionRank={getRegionRank}
          onSelectRegion={onSelectRegion}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
          selectedRegion={selectedRegion}
        />
      );
    case 'lolli':
      return (
        <NationalLollipopChart
          data={data}
          getStateRank={getStateRank}
          selectedState={selectedState}
          onSelectState={onSelectState}
          onViewStats={onViewStats}
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
