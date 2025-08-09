export interface BlockbusterData {
  states: {
    [key: string]: {
      score: number;
      components: {
        [key: string]: number;
      };
    };
  };
}

export interface BlockbusterDataContextType {
  data: BlockbusterData | null;
  loading: boolean;
  error: string | null;
  regionAverages?: { name: string; avg: number }[];
  regionAverageByName?: Record<string, number>;
  regionComponentsAverageByName?: Record<string, Record<string, number>>;
  getRegionRank?: (regionName: string) => number;
}
