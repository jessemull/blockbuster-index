'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ChevronSelect, Footer, PageBackground } from '@components/Shared';
import {
  RANKING_SIGNAL_OPTIONS,
  RankingSignalKey,
  StateNames,
  USAStateAbbreviation,
} from '@constants';
import { useBreakpoint } from '@hooks';
import { useBlockbusterData } from '@providers';
import { chunkColumns } from '@utils';

const Rankings: React.FC = () => {
  const { data, loading, error } = useBlockbusterData();
  const [selectedSignal, setSelectedSignal] = useState<RankingSignalKey>(
    RANKING_SIGNAL_OPTIONS[0].key,
  );
  const { colCount } = useBreakpoint();

  const getScore = useCallback(
    (stateData: { score: number; components?: Record<string, number> }) => {
      if (selectedSignal === 'score') return stateData.score;
      const val = stateData.components?.[selectedSignal];
      if (val == null) return null;
      return val;
    },
    [selectedSignal],
  );

  const sortedStates = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.states)
      .map(([code, stateData]) => ({
        code,
        name: StateNames[code as USAStateAbbreviation],
        score: getScore(stateData!),
      }))
      .filter(
        (s): s is { code: string; name: string; score: number } =>
          s.score !== null && s.score !== undefined,
      )
      .sort((a, b) => b.score - a.score);
  }, [data, getScore]);

  const columns = useMemo(
    () => chunkColumns(sortedStates, colCount),
    [sortedStates, colCount],
  );

  const globalRankMap = useMemo(
    () => new Map(sortedStates.map((s, i) => [s.code, i + 1])),
    [sortedStates],
  );

  return (
    <PageBackground>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-16 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-light text-brand-yellow mb-3 tracking-wide">
            Rankings
          </h1>
        </div>
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <label
            className="text-white text-lg md:text-xl mb-4 font-light"
            htmlFor="signal-select"
          >
            Select Signal
          </label>
          <ChevronSelect
            id="signal-select"
            options={RANKING_SIGNAL_OPTIONS.map(({ key, label }) => ({
              value: key,
              label,
            }))}
            value={selectedSignal}
            onChange={(value) => setSelectedSignal(value as RankingSignalKey)}
          />
        </div>
        <div className="text-white text-xs md:text-sm font-light max-w-xl mx-auto mb-4 md:mb-8 text-center min-h-[1.5em]">
          {
            RANKING_SIGNAL_OPTIONS.find((s) => s.key === selectedSignal)
              ?.description
          }
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
                <table
                  aria-label={
                    columns.length > 1
                      ? `Rankings column ${colIdx + 1} of ${columns.length}`
                      : 'State rankings'
                  }
                  className="w-full table-fixed text-left border-separate border-spacing-y-2"
                >
                  {' '}
                  <thead>
                    <tr>
                      <th className="w-1/5 text-brand-yellow font-semibold text-base px-2 py-2">
                        Rank
                      </th>
                      <th className="w-3/5 text-brand-yellow font-semibold text-base px-2 py-2">
                        State
                      </th>
                      <th className="w-1/5 text-brand-yellow font-semibold text-base pr-4 py-2 text-right">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {col.map((state) => (
                      <tr
                        key={state.code}
                        className="bg-brand-dark-blue border border-brand-yellow rounded-lg align-middle"
                      >
                        <td className="w-1/5 text-brand-yellow font-bold px-4 py-2 rounded-l-lg">
                          {globalRankMap.get(state.code)}
                        </td>
                        <td
                          className="w-3/5 text-white font-mono font-light px-2 py-2 text-sm md:text-base align-middle"
                          title={state.name}
                        >
                          {state.name}
                        </td>
                        <td className="w-1/5 text-white font-mono font-bold pr-4 py-2 rounded-r-lg text-right">
                          {state.score.toFixed(2)}
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
      <Footer />
    </PageBackground>
  );
};

export default Rankings;
