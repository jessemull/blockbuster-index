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
}
