'use client';

import React, { useMemo, useRef, useState } from 'react';
import { USAMap } from '../USAMap';
import { USAStateAbbreviation, StateNames } from '@constants';
import { useBlockbusterData } from './BlockbusterDataProvider';
import { States, Histogram, Lollipop } from '@components/Charts';

const BlockbusterIndex: React.FC = () => {
  const { data, error } = useBlockbusterData();
  const [selectedState, setSelectedState] =
    useState<USAStateAbbreviation | null>(null);
  type VizType = 'map' | 'hist' | 'lolli';
  const [selectedViz, setSelectedViz] = useState<VizType>('map');
  const statsSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollChartsIntoView = () => {
    statsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Compute scores, minScore, and maxScore only when data changes...

  const scores = useMemo(
    () => (data ? Object.values(data.states).map((s) => s.score) : []),
    [data],
  );
  const minScore = useMemo(
    () => (scores.length > 0 ? Math.min(...scores) : 0),
    [scores],
  );
  const maxScore = useMemo(
    () => (scores.length > 0 ? Math.max(...scores) : 100),
    [scores],
  );

  const getColorForScore = (score: number): string => {
    const range = maxScore - minScore || 1;
    const normalizedScore = Math.max(
      0,
      Math.min(1, (score - minScore) / range),
    );
    const bucket = Math.floor(normalizedScore * 20);
    const normalizedBucket = Math.max(0, Math.min(19, bucket));
    const red = Math.round(200 - normalizedBucket * 15); // 200 to 5 (very low red for blue).
    const green = Math.round(220 - normalizedBucket * 18); // 220 to 10 (very low green for blue).
    const blue = Math.round(255 - normalizedBucket * 10); // 255 to 65 (high blue throughout).
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // Modified createCustomStates to handle loading state...

  const createCustomStates = () => {
    const customStates: { [key: string]: any } = {};
    if (!data) {
      // All states muted gray, no interactivity...

      const allStates = Object.keys(StateNames);
      allStates.forEach((stateCode) => {
        customStates[stateCode] = {
          fill: '#444',
          stroke: '#f4dd32',
          onClick: undefined,
        };
      });
      return customStates;
    }
    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      customStates[stateCode] = {
        fill:
          stateCode === selectedState
            ? '#e6c82e'
            : getColorForScore(stateData.score),
        stroke: '#f4dd32',
        strokeWidth: stateCode === selectedState ? 2 : 1,
        onClick: () => setSelectedState(stateCode as USAStateAbbreviation),
        onDoubleClick: () => {
          setSelectedState(stateCode as USAStateAbbreviation);
          scrollChartsIntoView();
        },
      };
    });
    return customStates;
  };

  // Memoize sorted scores for ranking...

  const sortedScores = useMemo(() => {
    if (!scores.length) return [];
    return [...scores].sort((a, b) => b - a);
  }, [scores]);

  const getStateRank = (stateCode: string): number => {
    if (!data) return 0;
    const stateScore = data.states[stateCode]?.score || 0;
    const rank = sortedScores.indexOf(stateScore) + 1;
    return rank;
  };

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
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative w-full max-w-xs">
              <select
                aria-label="Select visualization"
                value={selectedViz}
                onChange={(e) => setSelectedViz(e.target.value as VizType)}
                className="appearance-none w-full bg-[#181a2b] border border-[#f4dd32] text-white py-1.5 md:py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4dd32] text-sm md:text-base font-mono font-semibold shadow-md transition-colors cursor-pointer hover:border-yellow-400"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                <option className="text-black" value="map">
                  USA Heat Map
                </option>
                <option className="text-black" value="hist">
                  Histogram
                </option>
                <option className="text-black" value="lolli">
                  Lollipop
                </option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L11 14L15 10"
                    stroke="#f4dd32"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="mb-2 md:mb-4 lg:mb-6 flex flex-col items-center md:flex-row md:justify-between md:items-end w-full">
            <div className="mb-2 md:mb-0">
              <h2 className="text-base md:text-xl font-normal text-white mb-1">
                E-commerce vs. Brick-and-Mortar
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light text-center md:text-left mb-3">
                Click or tap a state to view its score.
              </p>
            </div>
            <div className="mb-8 md:mb-4 md:mt-0 flex flex-col items-center md:items-end">
              <div className="relative flex flex-col items-center">
                <div
                  className="w-64 md:w-80 h-4 border border-white rounded"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(200, 220, 255), rgb(5, 10, 65))',
                  }}
                ></div>
                <div className="flex justify-between text-xs text-white mt-2 w-64 md:w-80">
                  <span>Brick-and-Mortar</span>
                  <span>E-commerce</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full flex flex-col items-center">
            {selectedViz === 'map' && (
              <USAMap
                customStates={createCustomStates()}
                defaultState={{ fill: '#374151', stroke: '#4B5563' }}
                mapSettings={{ width: '100%' }}
                className="w-full"
              />
            )}
            {selectedViz === 'hist' && data && (
              <Histogram
                scoresByState={Object.fromEntries(
                  Object.entries(data.states).map(([k, v]) => [k, v.score]),
                )}
                className="w-full"
              />
            )}
            {selectedViz === 'lolli' && data && (
              <Lollipop
                scoresByState={Object.fromEntries(
                  Object.entries(data.states).map(([k, v]) => [k, v.score]),
                )}
                className="w-full"
              />
            )}

            {!data && (
              <div className="text-gray-500 text-xs mt-4">
                Loading map data...
              </div>
            )}
          </div>
          {selectedState && data && (
            <div className="hidden lg:block absolute top-1/2 right-0 transform translate-y-4 translate-x-24">
              <div className="w-40 text-center">
                <div className="font-medium text-white mb-1 text-sm">
                  {StateNames[selectedState]}
                </div>
                <div className="text-[#f4dd32] font-bold text-xl">
                  {data.states[selectedState].score}
                </div>
                <div className="text-xs text-white mt-1">
                  Rank: {getStateRank(selectedState)}
                </div>
                <button
                  onClick={scrollChartsIntoView}
                  className="hidden lg:inline-flex items-center px-2 py-1 bg-[#0f1029] text-[#f4dd32] border border-[#f4dd32] text-[0.625rem] rounded-lg hover:bg-[#1a1b3a] transition-colors mt-4"
                  aria-label="View Stats"
                >
                  View Stats
                </button>
              </div>
            </div>
          )}
          {selectedState && data && (
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
      </div>
      <div ref={statsSectionRef} />
      {data && selectedState && (
        <States data={data} stateCode={selectedState} />
      )}
      <footer className="text-center pt-24 pb-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default BlockbusterIndex;
