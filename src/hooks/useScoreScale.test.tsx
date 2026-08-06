import { renderHook } from '@testing-library/react';
import useScoreScale from './useScoreScale';

describe('useScoreScale', () => {
  it('maps min score to the lightest bucket color', () => {
    const { result } = renderHook(() => useScoreScale(0, 100));
    expect(result.current.getColorForScore(0)).toBe('rgb(200, 220, 255)');
  });

  it('maps max score to the darkest bucket color', () => {
    const { result } = renderHook(() => useScoreScale(0, 100));
    expect(result.current.getColorForScore(100)).toBe('rgb(5, 22, 65)');
  });

  it('clamps scores outside the range', () => {
    const { result } = renderHook(() => useScoreScale(10, 20));
    expect(result.current.getColorForScore(-50)).toBe(
      result.current.getColorForScore(10),
    );
    expect(result.current.getColorForScore(999)).toBe(
      result.current.getColorForScore(20),
    );
  });
});
