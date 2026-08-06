import { useMemo } from 'react';
import { BlockbusterData } from '@types';

const useScoreStats = (data: BlockbusterData | null) => {
  const scores = useMemo(
    () =>
      data
        ? Object.values(data.states)
            .filter((s): s is NonNullable<typeof s> => Boolean(s))
            .map((s) => s.score)
        : [],
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

  const rankedStateCodes = useMemo(() => {
    if (!data) return [] as string[];
    return Object.entries(data.states)
      .filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] =>
        Boolean(entry[1]),
      )
      .sort((a, b) => b[1].score - a[1].score)
      .map(([code]) => code);
  }, [data]);

  const getStateRank = (stateCode: string): number => {
    const index = rankedStateCodes.indexOf(stateCode);
    return index === -1 ? 0 : index + 1;
  };

  return { scores, minScore, maxScore, sortedScores, getStateRank } as const;
};

export default useScoreStats;
