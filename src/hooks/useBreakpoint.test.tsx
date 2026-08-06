import { act, renderHook } from '@testing-library/react';
import useBreakpoint from './useBreakpoint';

describe('useBreakpoint', () => {
  const setWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
  };

  it('reports sm below 768', () => {
    setWidth(500);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('sm');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.colCount).toBe(1);
  });

  it('reports md between 768 and 1023', () => {
    setWidth(800);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('md');
    expect(result.current.colCount).toBe(2);
  });

  it('reports lg at 1024+ and updates on resize', () => {
    setWidth(1200);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe('lg');
    expect(result.current.colCount).toBe(3);

    act(() => {
      setWidth(500);
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.breakpoint).toBe('sm');
  });
});
