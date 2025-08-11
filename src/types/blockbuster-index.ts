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
  error: string | null;
  getRegionRank?: (regionName: string) => number;
  loading: boolean;
  regionAverageByName?: Record<string, number>;
  regionAverages?: { name: string; avg: number }[];
  regionComponentsAverageByName?: Record<string, Record<string, number>>;
}
