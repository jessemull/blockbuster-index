'use client';

import Header from './Header';
import React, { useRef, useState } from 'react';
import SubHeader from './SubHeader';
import VisualizationRouter from './VisualizationRouter';
import VizSelector from './VizSelector';
import { Footer, PageBackground } from '@components/Shared';
import { SelectedRegionCharts } from '@components/Charts';
import { SelectedStateCharts } from '@components/Charts';
import { USAStateAbbreviation, VizType } from '@constants';
import { useBlockbusterData } from '@providers';
import { useScoreStats, useScoreScale } from '@hooks';

const BlockbusterIndex: React.FC = () => {
  const { data, error, loading, getRegionRank, regionAverageByName } =
    useBlockbusterData();
  const [selectedState, setSelectedState] =
    useState<USAStateAbbreviation | null>(null);
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
    <PageBackground>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-14 flex flex-col">
        <Header />
        <div className="relative">
          <div className="mb-2 md:mb-4 lg:mb-6 flex flex-col items-center md:flex-row md:justify-between md:items-end w-full">
            <SubHeader />
            <VizSelector
              value={selectedViz}
              onChange={(v: VizType) => setSelectedViz(v)}
              disabled={loading}
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
                  avg: regionAverageByName[name] || 0,
                })
              }
              onViewStats={scrollChartsIntoView}
              getStateRank={getStateRank}
              getRegionRank={getRegionRank}
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
      <Footer className="text-center pt-24 pb-4 mt-auto" />
    </PageBackground>
  );
};

export default BlockbusterIndex;
