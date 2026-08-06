'use client';

import React, { useRef, useState } from 'react';
import { SelectedRegionCharts } from '@components/Charts';
import { SelectedStateCharts } from '@components/Charts';
import { Footer, PageBackground } from '@components/Shared';
import { USAStateAbbreviation, VizType } from '@constants';
import { useScoreScale, useScoreStats } from '@hooks';
import { useBlockbusterData } from '@providers';
import Header from './Header';
import SubHeader from './SubHeader';
import VisualizationRouter from './VisualizationRouter';
import VizSelector from './VizSelector';

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
              disabled={loading}
              value={selectedViz}
              onChange={(v: VizType) => setSelectedViz(v)}
            />
          </div>
          <div className="relative w-full flex flex-col items-center">
            <VisualizationRouter
              data={data}
              getStateRank={getStateRank}
              selectedState={selectedState}
              vizType={selectedViz}
              getColorForScore={getColorForScore}
              getRegionRank={getRegionRank}
              loading={loading}
              onSelectRegion={(name: string) =>
                setSelectedRegion({
                  name,
                  avg: regionAverageByName[name] || 0,
                })
              }
              onSelectState={setSelectedState}
              onViewStats={scrollChartsIntoView}
              selectedRegion={selectedRegion}
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
            showTitle={selectedViz === 'lolli'}
            stateCode={selectedState}
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
