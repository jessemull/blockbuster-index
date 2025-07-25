'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

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

interface BlockbusterDataContextType {
  data: BlockbusterData | null;
  loading: boolean;
  error: string | null;
}

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
        // (Removed inversion logic for CENSUS and WALMART)
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

  return (
    <BlockbusterDataContext.Provider value={{ data, loading, error }}>
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
