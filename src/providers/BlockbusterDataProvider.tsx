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

const DATA_FETCH_TIMEOUT_MS = 15_000;

const BlockbusterDataContext = createContext<
  BlockbusterDataContextType | undefined
>(undefined);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidStateScore = (value: unknown): boolean => {
  if (!isPlainObject(value)) return false;
  if (typeof value.score !== 'number' || !Number.isFinite(value.score)) {
    return false;
  }
  if (value.components === undefined) return true;
  if (!isPlainObject(value.components)) return false;
  return Object.values(value.components).every(
    (component) => typeof component === 'number' && Number.isFinite(component),
  );
};

const isValidBlockbusterData = (value: unknown): value is BlockbusterData => {
  if (!isPlainObject(value) || !isPlainObject(value.states)) return false;
  return Object.values(value.states).every(isValidStateScore);
};

export const BlockbusterDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<BlockbusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      DATA_FETCH_TIMEOUT_MS,
    );
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/data.json', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        if (!isValidBlockbusterData(jsonData)) {
          throw new Error('Invalid data format');
        }
        if (!active) return;
        setData(jsonData);
        setError(null);
      } catch (err) {
        if (!active) return;
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out');
          setData(null);
          return;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
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
