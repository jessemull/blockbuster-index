'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { BlockbusterData, BlockbusterDataContextType } from '@types';
import { CENSUS_DIVISIONS } from '@constants';
import { useMemo } from 'react';

const BlockbusterDataContext = createContext<
  BlockbusterDataContextType | undefined
>(undefined);

export const BlockbusterDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<BlockbusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const regionAverages = useMemo(() => {
    if (!data) return [] as { name: string; avg: number }[];
    const entries = Object.entries(CENSUS_DIVISIONS).map(([name, states]) => {
      const vals = states
        .map((s) => data.states[s as keyof typeof data.states]?.score)
        .filter((n) => typeof n === 'number') as number[];
      const avg = vals.length
        ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : 0;
      return { name, avg };
    });
    entries.sort((a, b) => b.avg - a.avg);
    return entries;
  }, [data]);

  const regionAverageByName = useMemo(() => {
    const map: Record<string, number> = {};
    regionAverages.forEach((r) => {
      map[r.name] = r.avg;
    });
    return map;
  }, [regionAverages]);

  const regionComponentsAverageByName = useMemo(() => {
    if (!data) return {} as Record<string, Record<string, number>>;
    const result: Record<string, Record<string, number>> = {};
    Object.entries(CENSUS_DIVISIONS).forEach(([name, states]) => {
      const componentSums: Record<string, number> = {};
      let count = 0;
      states.forEach((code) => {
        const st = data.states[code];
        if (!st) return;
        const comps = st.components || {};
        Object.keys(comps).forEach((k) => {
          componentSums[k] = (componentSums[k] || 0) + (comps[k] ?? 0);
        });
        count += 1;
      });
      const averages: Record<string, number> = {};
      Object.keys(componentSums).forEach((k) => {
        averages[k] = count ? Number((componentSums[k] / count).toFixed(2)) : 0;
      });
      result[name] = averages;
    });
    return result;
  }, [data]);

  const getRegionRank = (regionName: string): number => {
    const idx = regionAverages.findIndex((r) => r.name === regionName);
    return idx === -1 ? 0 : idx + 1;
  };

  return (
    <BlockbusterDataContext.Provider
      value={{
        data,
        loading,
        error,
        regionAverages,
        regionAverageByName,
        regionComponentsAverageByName,
        getRegionRank,
      }}
    >
      {children}
    </BlockbusterDataContext.Provider>
  );
};

export const useBlockbusterData = () => {
  const context = useContext(BlockbusterDataContext);
  if (context === undefined) {
    throw new Error(
      'useBlockbusterData must be used within a BlockbusterDataProvider',
    );
  }
  return context;
};
