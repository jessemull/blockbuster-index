import useScoreStats from './useScoreStats';
import { renderHook } from '@testing-library/react';

const mockData = {
  states: {
    CA: { score: 75, components: {} },
    NY: { score: 45, components: {} },
    TX: { score: 90, components: {} },
  },
};

describe('useScoreStats', () => {
  it('calculates correct statistics', () => {
    const { result } = renderHook(() => useScoreStats(mockData));

    expect(result.current.scores).toHaveLength(3);
    expect(result.current.minScore).toBe(45);
    expect(result.current.maxScore).toBe(90);
  });

  it('returns correct state rank', () => {
    const { result } = renderHook(() => useScoreStats(mockData));

    expect(result.current.getStateRank('CA')).toBe(2);
    expect(result.current.getStateRank('NY')).toBe(3);
    expect(result.current.getStateRank('TX')).toBe(1);
  });

  it('returns rank 0 for non-existent state code', () => {
    const { result } = renderHook(() => useScoreStats(mockData));

    expect(result.current.getStateRank('XX')).toBe(0);
  });

  it('returns rank 0 when data is null', () => {
    const { result } = renderHook(() => useScoreStats(null));

    expect(result.current.getStateRank('CA')).toBe(0);
  });

  it('handles empty data', () => {
    const { result } = renderHook(() => useScoreStats({ states: {} }));

    expect(result.current.scores).toHaveLength(0);
    expect(result.current.minScore).toBe(0);
    expect(result.current.maxScore).toBe(100);
  });
});
