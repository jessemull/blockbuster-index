import { useCallback } from 'react';

const useScoreScale = (minScore: number, maxScore: number) => {
  const getColorForScore = useCallback(
    (score: number): string => {
      const range = maxScore - minScore || 1;
      const normalizedScore = Math.max(
        0,
        Math.min(1, (score - minScore) / range),
      );
      const bucket = Math.floor(normalizedScore * 20);
      const normalizedBucket = Math.max(0, Math.min(19, bucket));
      const red = Math.round(200 - normalizedBucket * 15);
      const green = Math.round(220 - normalizedBucket * 18);
      const blue = Math.round(255 - normalizedBucket * 10);
      return `rgb(${red}, ${green}, ${blue})`;
    },
    [minScore, maxScore],
  );
  return { getColorForScore } as const;
};

export default useScoreScale;
