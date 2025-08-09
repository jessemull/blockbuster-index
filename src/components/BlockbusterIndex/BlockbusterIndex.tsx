'use client';

import React, { useRef, useState } from 'react';
import { USAStateAbbreviation, StateNames } from '@constants';
import { useBlockbusterData } from '@providers';
import { States, RegionalBars, Lollipop } from '@components/Charts';
import ScoreBadge from './ScoreBadge';
import VizSelector from './VizSelector';
import GradientLegend from './GradientLegend';
import MapView from './MapView';
import RegionCharts from './RegionCharts';
import { useScoreStats, useScoreScale } from '@hooks';

const BlockbusterIndex: React.FC = () => {
  const { data, error, getRegionRank, regionAverageByName } =
    useBlockbusterData();
  const [selectedState, setSelectedState] =
    useState<USAStateAbbreviation | null>(null);
  type VizType = 'map' | 'hist' | 'lolli' | 'regional';
  const [selectedViz, setSelectedViz] = useState<VizType>('map');
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    avg: number;
  } | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(
    null,
  );
  const statsSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollChartsIntoView = () => {
    statsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const { minScore, maxScore, getStateRank } = useScoreStats(data || null);

  const { getColorForScore } = useScoreScale(minScore, maxScore);

  // regionAverages and getRegionRank now come from provider

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
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
            The Blockbuster Index
          </h1>
          <p className="text-xs md:text-sm text-white max-w-3xl mx-auto leading-relaxed font-light mb-4">
            An exploration of how consumer buying habits have shifted from
            traditional brick-and-mortar stores to e-commerce across the United
            States. Inspired by the nostalgic decline of video rental stores.
          </p>
        </div>
        <div className="relative">
          <VizSelector
            value={selectedViz}
            onChange={(v: VizType) => setSelectedViz(v)}
          />
          <div className="mb-2 md:mb-4 lg:mb-6 flex flex-col items-center md:flex-row md:justify-between md:items-end w-full">
            <div className="mb-2 md:mb-0">
              <h2 className="text-base md:text-xl font-normal text-white mb-1">
                E-commerce vs. Brick-and-Mortar
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light text-center md:text-left mb-3">
                Click or tap a state to view its score.
              </p>
            </div>
            <GradientLegend />
          </div>
          <div className="relative w-full flex flex-col items-center">
            {selectedViz === 'map' && data && (
              <MapView
                data={data}
                selectedState={selectedState}
                onSelectState={setSelectedState}
                getColorForScore={getColorForScore}
                isRegional={false}
                selectedRegion={null}
                onSelectRegion={() => {}}
              />
            )}
            {selectedViz === 'regional' && data && (
              <MapView
                data={data}
                selectedState={selectedState}
                onSelectState={setSelectedState}
                getColorForScore={getColorForScore}
                isRegional={true}
                selectedRegion={selectedRegionName}
                onSelectRegion={setSelectedRegionName}
              />
            )}
            {selectedViz === 'hist' && data && (
              <div className="relative w-full">
                <RegionalBars
                  className="w-full"
                  onSelectRegion={(name, avg) =>
                    setSelectedRegion({ name, avg })
                  }
                />
                {selectedRegion && (
                  <div className="hidden lg:block absolute top-0 right-0 translate-x-6">
                    <div className="w-48 text-center">
                      <div className="font-medium text-white mb-1 text-sm">
                        {selectedRegion.name}
                      </div>
                      <div className="text-[#f4dd32] font-bold text-xl">
                        {selectedRegion.avg}
                      </div>
                      <div className="text-xs text-white mt-1">
                        Rank:{' '}
                        {getRegionRank ? getRegionRank(selectedRegion.name) : 0}
                      </div>
                      <button
                        onClick={scrollChartsIntoView}
                        className="inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
                        aria-label="View Stats"
                      >
                        View Stats
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedViz === 'lolli' && data && (
              <div className="relative w-full">
                <Lollipop
                  scoresByState={Object.fromEntries(
                    Object.entries(data.states).map(([k, v]) => [k, v.score]),
                  )}
                  className="w-full"
                  onSelectState={(code) =>
                    setSelectedState(code as USAStateAbbreviation)
                  }
                />
                {selectedState && (
                  <ScoreBadge
                    stateCode={selectedState}
                    score={data.states[selectedState].score}
                    rank={getStateRank(selectedState)}
                    onViewStats={scrollChartsIntoView}
                    className="hidden lg:block absolute top-0 right-0 translate-x-6"
                  />
                )}
              </div>
            )}
            {!data && (
              <div className="text-gray-500 text-xs mt-4">
                Loading map data...
              </div>
            )}
          </div>
          {selectedState && data && selectedViz === 'map' && (
            <div className="lg:hidden block mt-4 mb-8 mx-auto w-40 text-center">
              <div className="font-medium text-white mb-1 text-sm">
                {StateNames[selectedState]}
              </div>
              <div className="text-[#f4dd32] font-bold text-xl">
                {data.states[selectedState].score}
              </div>
              <div className="text-xs text-white mt-1">
                Rank: {getStateRank(selectedState)}
              </div>
            </div>
          )}
        </div>
        {selectedState && data && selectedViz === 'map' && (
          <div className="hidden lg:block absolute top-1/2 right-0 transform translate-y-4 translate-x-24">
            <ScoreBadge
              stateCode={selectedState}
              score={data.states[selectedState].score}
              rank={getStateRank(selectedState)}
              onViewStats={scrollChartsIntoView}
            />
          </div>
        )}
        {selectedRegionName &&
          regionAverageByName &&
          selectedViz === 'regional' && (
            <div className="hidden lg:block absolute top-1/2 right-0 transform translate-y-4 translate-x-24">
              <div className="w-48 text-center">
                <div className="font-medium text-white mb-1 text-sm">
                  {selectedRegionName}
                </div>
                <div className="text-[#f4dd32] font-bold text-xl">
                  {regionAverageByName[selectedRegionName] || 0}
                </div>
                <div className="text-xs text-white mt-1">
                  Rank: {getRegionRank ? getRegionRank(selectedRegionName) : 0}
                </div>
                <button
                  onClick={scrollChartsIntoView}
                  className="inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
                >
                  View Stats
                </button>
              </div>
            </div>
          )}
        {selectedRegionName &&
          regionAverageByName &&
          selectedViz === 'regional' && (
            <div className="lg:hidden block mt-4 mb-8 mx-auto w-40 text-center">
              <div className="font-medium text-white mb-1 text-sm">
                {selectedRegionName}
              </div>
              <div className="text-[#f4dd32] font-bold text-xl">
                {regionAverageByName[selectedRegionName] || 0}
              </div>
              <div className="text-xs text-white mt-1">
                Rank: {getRegionRank ? getRegionRank(selectedRegionName) : 0}
              </div>
            </div>
          )}
      </div>
      <div ref={statsSectionRef} />
      {data && selectedViz === 'map' && selectedState && (
        <States data={data} stateCode={selectedState} />
      )}
      {data && selectedViz === 'lolli' && selectedState && (
        <States data={data} stateCode={selectedState} />
      )}
      {data && selectedViz === 'hist' && selectedRegion && (
        <RegionCharts data={data} regionName={selectedRegion.name} />
      )}
      {data && selectedViz === 'regional' && selectedRegionName && (
        <RegionCharts data={data} regionName={selectedRegionName} />
      )}
      <footer className="text-center pt-24 pb-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default BlockbusterIndex;
