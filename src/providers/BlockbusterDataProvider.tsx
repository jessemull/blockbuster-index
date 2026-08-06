'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CENSUS_DIVISIONS } from '@constants';
import { BlockbusterData, BlockbusterDataContextType } from '@types';

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
        if (
          !jsonData ||
          typeof jsonData !== 'object' ||
          !jsonData.states ||
          typeof jsonData.states !== 'object'
        ) {
          throw new Error('Invalid data format');
        }
        setData(jsonData as BlockbusterData);
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
        .filter((n): n is number => typeof n === 'number');
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
        const st = data.states[code as keyof typeof data.states];
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

  const getRegionRank = useCallback(
    (regionName: string): number => {
      const idx = regionAverages.findIndex((r) => r.name === regionName);
      return idx === -1 ? 0 : idx + 1;
    },
    [regionAverages],
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      regionAverages,
      regionAverageByName,
      regionComponentsAverageByName,
      getRegionRank,
    }),
    [
      data,
      loading,
      error,
      regionAverages,
      regionAverageByName,
      regionComponentsAverageByName,
      getRegionRank,
    ],
  );

  return (
    <BlockbusterDataContext.Provider value={value}>
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
