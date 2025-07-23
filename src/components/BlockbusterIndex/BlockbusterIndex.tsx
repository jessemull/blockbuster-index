'use client';

import React, { useEffect, useState } from 'react';
import { USAMap, USAStateAbbreviation, StateNames } from '../USAMap';

interface BlockbusterData {
  states: {
    [key: string]: {
      score: number;
      components: {
        [key: string]: number;
      };
    };
  };
}

interface BlockbusterIndexProps {}

const BlockbusterIndex: React.FC<BlockbusterIndexProps> = () => {
  const [data, setData] = useState<BlockbusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] =
    useState<USAStateAbbreviation | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        // Set selectedState to the state with the highest score
        const entries = Object.entries((jsonData as BlockbusterData).states);
        if (entries.length > 0) {
          const [topState] = entries.reduce((max, curr) =>
            curr[1].score > max[1].score ? curr : max,
          );
          setSelectedState(topState as USAStateAbbreviation);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(
          window.innerWidth < 640 || /Mobi|Android/i.test(navigator.userAgent),
        );
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getColorForScore = (score: number): string => {
    // Use actual data range: 25.75 to 80.25 (range of ~54.5)
    const minScore = 25;
    const maxScore = 81;
    const range = maxScore - minScore;

    // Normalize score to 0-1 range based on actual data
    const normalizedScore = Math.max(
      0,
      Math.min(1, (score - minScore) / range),
    );

    // Create 20 buckets for better granularity
    const bucket = Math.floor(normalizedScore * 20);
    const normalizedBucket = Math.max(0, Math.min(19, bucket));

    // Create a pure blue gradient similar to the reference image
    // Light blue (low scores) to dark blue (high scores)
    const red = Math.round(200 - normalizedBucket * 15); // 200 to 5 (very low red for blue)
    const green = Math.round(220 - normalizedBucket * 18); // 220 to 10 (very low green for blue)
    const blue = Math.round(255 - normalizedBucket * 10); // 255 to 65 (high blue throughout)

    return `rgb(${red}, ${green}, ${blue})`;
  };

  const createCustomStates = () => {
    if (!data) return {};
    const customStates: { [key in USAStateAbbreviation]?: any } = {};
    Object.entries(data.states).forEach(([stateCode, stateData]) => {
      customStates[stateCode as USAStateAbbreviation] = {
        fill: getColorForScore(stateData.score),
        stroke: '#333',
        onClick: () => setSelectedState(stateCode as USAStateAbbreviation),
      };
    });
    return customStates;
  };

  const getStateRank = (stateCode: string): number => {
    if (!data) return 0;

    const stateScore = data.states[stateCode]?.score || 0;
    const allScores = Object.values(data.states).map((state) => state.score);
    const sortedScores = [...allScores].sort((a, b) => b - a); // Sort descending
    const rank = sortedScores.indexOf(stateScore) + 1;

    return rank;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading Blockbuster Index...</div>
      </div>
    );
  }

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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-16 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-8 lg:mb-12">
          <h1 className="text-2xl md:text-4xl font-light text-white mb-2 tracking-wide">
            The Blockbuster Index
          </h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-4">
            An exploration of how consumer buying habits have shifted from
            traditional brick-and-mortar stores to digital purchases across the
            United States. Inspired by the nostalgic decline of physical video
            rental stores.
          </p>
        </div>
        {/* Map Container */}
        <div className="relative">
          <div className="mb-2 flex flex-col items-center md:flex-row md:justify-between md:items-end w-full">
            <div className="mb-2 md:mb-0">
              <h2 className="text-base md:text-xl font-normal text-white mb-1">
                Digital vs. Physical Shopping
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light text-center md:text-left mb-3">
                Click or tap a state to view its score.
              </p>
            </div>
            {/* Gradient Legend */}
            <div className="mb-4 md:mt-0 flex flex-col items-center md:items-end">
              <div className="relative flex flex-col items-center">
                <div
                  className="w-64 md:w-80 h-4 border border-white rounded"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(200, 220, 255), rgb(5, 10, 65))',
                  }}
                ></div>
                <div className="flex justify-between text-xs text-white mt-2 w-64 md:w-80">
                  <span>Physical</span>
                  <span>Digital</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full flex flex-col items-center">
            <USAMap
              customStates={createCustomStates()}
              defaultState={{
                fill: '#374151',
                stroke: '#4B5563',
              }}
              mapSettings={{
                width: '100%',
              }}
              className="w-full"
            />
            {/* Score block for mobile/tablet, always directly below map */}
            {selectedState && data && (
              <div className="block mt-4 mb-8 mx-auto max-w-xs text-center">
                <div className="font-medium text-white mb-1">
                  {StateNames[selectedState]}
                </div>
                <div className="text-blue-300 font-bold text-xl">
                  {data.states[selectedState].score}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Rank: {getStateRank(selectedState)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center py-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default BlockbusterIndex;
