import { useMemo } from 'react';
import { BlockbusterData } from '@types';

export const useScoreStats = (data: BlockbusterData | null) => {
  const scores = useMemo(
    () => (data ? Object.values(data.states).map((s) => s.score) : []),
    [data],
  );

  const minScore = useMemo(
    () => (scores.length > 0 ? Math.min(...scores) : 0),
    [scores],
  );

  const maxScore = useMemo(
    () => (scores.length > 0 ? Math.max(...scores) : 100),
    [scores],
  );

  const sortedScores = useMemo(() => {
    if (!scores.length) return [] as number[];
    return [...scores].sort((a, b) => b - a);
  }, [scores]);

  const getStateRank = (stateCode: string): number => {
    if (!data) return 0;
    const stateScore = data.states[stateCode]?.score || 0;
    const rank = sortedScores.indexOf(stateScore) + 1;
    return rank;
  };

  return { scores, minScore, maxScore, sortedScores, getStateRank } as const;
};

export default useScoreStats;
