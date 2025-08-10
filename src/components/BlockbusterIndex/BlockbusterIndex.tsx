'use client';

import React, { useRef, useState } from 'react';
import { SelectedRegionCharts } from '@components/Charts';
import VisualizationRouter from './VisualizationRouter';
import VizSelector from './VizSelector';
import { SelectedStateCharts } from '@components/Charts';
import { USAStateAbbreviation } from '@constants';
import { useBlockbusterData } from '@providers';
import { useScoreStats, useScoreScale } from '@hooks';

const BlockbusterIndex: React.FC = () => {
  const { data, error, loading, getRegionRank, regionAverageByName } =
    useBlockbusterData();
  const [selectedState, setSelectedState] =
    useState<USAStateAbbreviation | null>(null);
  type VizType = 'map' | 'hist' | 'lolli' | 'regional';
  const [selectedViz, setSelectedViz] = useState<VizType>('map');
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    avg: number;
  } | null>(null);
  const statsSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollChartsIntoView = () => {
    statsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const { minScore, maxScore, getStateRank } = useScoreStats(data || null);
  const { getColorForScore } = useScoreScale(minScore, maxScore);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-black to-blue-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-14 flex flex-col">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
            The Blockbuster Index
          </h1>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light">
            An exploration of how consumer buying habits have shifted from
            traditional brick-and-mortar stores to e-commerce across the United
            States. Inspired by the nostalgic decline of video rental stores.
          </p>
        </div>
        <div className="relative">
          <div className="mb-2 md:mb-4 lg:mb-6 flex flex-col items-center md:flex-row md:justify-between md:items-end w-full">
            <div className="mb-2 md:mb-0">
              <h2 className="text-base md:text-lg font-normal text-white mb-1">
                E-commerce vs. Brick-and-Mortar
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light text-center md:text-left mb-3">
                Click or tap a state to view its score.
              </p>
            </div>
            <VizSelector
              value={selectedViz}
              onChange={(v: VizType) => setSelectedViz(v)}
            />
          </div>
          <div className="relative w-full flex flex-col items-center">
            <VisualizationRouter
              vizType={selectedViz}
              data={data}
              loading={loading}
              selectedState={selectedState}
              selectedRegion={selectedRegion}
              onSelectState={setSelectedState}
              onSelectRegion={(name: string) =>
                setSelectedRegion({
                  name,
                  avg: regionAverageByName?.[name] || 0,
                })
              }
              onViewStats={scrollChartsIntoView}
              getStateRank={getStateRank}
              getRegionRank={getRegionRank || (() => 0)}
              getColorForScore={getColorForScore}
            />
          </div>
        </div>
      </div>
      <div ref={statsSectionRef} />
      {data &&
        (selectedViz === 'map' || selectedViz === 'lolli') &&
        selectedState && (
          <SelectedStateCharts
            data={data}
            stateCode={selectedState}
            showTitle={selectedViz === 'lolli'}
          />
        )}
      {data &&
        (selectedViz === 'hist' || selectedViz === 'regional') &&
        selectedRegion && (
          <SelectedRegionCharts
            data={data}
            regionName={selectedRegion.name}
            showTitle={selectedViz === 'hist'}
          />
        )}
      <footer className="text-center pt-24 pb-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default BlockbusterIndex;
