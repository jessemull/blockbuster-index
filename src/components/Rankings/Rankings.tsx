'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { StateNames } from '../USAMap/data/state-names';
import { useBlockbusterData } from '../BlockbusterIndex/BlockbusterDataProvider';

const signals = [
  {
    key: 'score',
    label: 'Blockbuster Index',
    description:
      'Blockbuster Index: Weighted combination of all signals, normalized to population.',
  },
  {
    key: 'AMAZON',
    label: 'Amazon',
    description:
      'Amazon: Amazon job scraping with ninety day sliding window, normalized to population.',
  },
  {
    key: 'CENSUS',
    label: 'Census',
    description:
      'Census: Number of retail stores per state, normalized to population. Inverted signal, more retail stores results in a smaller e-commerce footprint.',
  },
  {
    key: 'BROADBAND',
    label: 'Broadband',
    description: 'Broadband: Broadband access normalized to population.',
  },
  {
    key: 'WALMART',
    label: 'Walmart',
    description:
      'Walmart: Number of brick-and-mortar Walmart jobs. Inverted signal, more walmart jobs results in a smaller e-commerce footprint.',
  },
];

function chunkColumns<T>(arr: T[], columns: number): T[][] {
  const len = arr.length;
  const base = Math.ceil(len / columns);
  const result: T[][] = [];
  let start = 0;
  for (let i = 0; i < columns; i++) {
    const end = i === columns - 1 ? len : start + base;
    result.push(arr.slice(start, end));
    start = end;
  }
  return result;
}

const Rankings: React.FC = () => {
  const { data, loading, error } = useBlockbusterData();
  const [selectedSignal, setSelectedSignal] = useState('score');
  const [colCount, setColCount] = useState(1);

  useEffect(() => {
    const updateColCount = () => {
      if (window.innerWidth >= 1024) setColCount(3);
      else if (window.innerWidth >= 768) setColCount(2);
      else setColCount(1);
    };
    updateColCount();
    window.addEventListener('resize', updateColCount);
    return () => window.removeEventListener('resize', updateColCount);
  }, []);

  const getScore = (stateData: any) => {
    if (selectedSignal === 'score') return stateData.score;
    const val = stateData.components?.[selectedSignal];
    if (val == null) return null;
    return val;
  };

  const sortedStates = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.states)
      .map(([code, stateData]) => ({
        code,
        name: StateNames[code],
        score: getScore(stateData),
      }))
      .filter((s) => s.score !== null && s.score !== undefined)
      .sort((a, b) => b.score - a.score);
  }, [data, selectedSignal]);

  const columns = useMemo(
    () => chunkColumns(sortedStates, colCount),
    [sortedStates, colCount],
  );

  const globalRankMap = useMemo(
    () => new Map(sortedStates.map((s, i) => [s.code, i + 1])),
    [sortedStates],
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-black to-blue-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-16 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-[#f4dd32] mb-3 tracking-wide">
            Rankings
          </h1>
        </div>
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <label
            htmlFor="signal-select"
            className="text-white text-lg md:text-xl mb-4 font-light"
          >
            Select Signal
          </label>
          <div className="relative w-full max-w-xs">
            <select
              id="signal-select"
              value={selectedSignal}
              onChange={(e) => setSelectedSignal(e.target.value)}
              className="appearance-none w-full bg-[#181a2b] border border-[#f4dd32] text-white py-1.5 md:py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4dd32] text-sm md:text-base font-mono font-semibold shadow-md transition-colors cursor-pointer hover:border-yellow-400"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {signals.map((signal) => (
                <option
                  key={signal.key}
                  value={signal.key}
                  className="text-black"
                >
                  {signal.label}
                </option>
              ))}
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
        <div className="text-white text-xs md:text-sm font-light max-w-xl mx-auto mb-4 md:mb-8 text-center min-h-[1.5em]">
          {signals.find((s) => s.key === selectedSignal)?.description}
        </div>
        {loading ? (
          <div className="text-gray-400 text-center py-8">
            Loading rankings...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div
            className={`w-full flex flex-col ${colCount > 1 ? 'md:flex-row md:gap-8 justify-center' : ''} lg:gap-8`}
          >
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className={`flex-1 max-w-sm mx-auto mb-8 md:mb-0`}
              >
                <table className="w-full table-fixed text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="w-1/5 text-[#f4dd32] font-semibold text-base px-2 py-2">
                        Rank
                      </th>
                      <th className="w-3/5 text-[#f4dd32] font-semibold text-base px-2 py-2">
                        State
                      </th>
                      <th className="w-1/5 text-[#f4dd32] font-semibold text-base pr-4 py-2 text-right">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {col.map((state) => (
                      <tr
                        key={state.code}
                        className="bg-[#181a2b] border border-[#f4dd32] rounded-lg align-middle"
                      >
                        <td className="w-1/5 text-[#f4dd32] font-bold px-4 py-2 rounded-l-lg">
                          {globalRankMap.get(state.code)}
                        </td>
                        <td
                          className="w-3/5 text-white font-mono font-light px-2 py-2 text-sm md:text-base align-middle"
                          title={state.name}
                        >
                          {state.name}
                        </td>
                        <td className="w-1/5 text-white font-mono font-bold pr-4 py-2 rounded-r-lg text-right">
                          {state.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="text-center py-4 mt-auto">
        <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © 2024</p>
      </footer>
    </div>
  );
};

export default Rankings;
