import { useCallback, useEffect, useState } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg';

const getBreakpoint = (width: number): Breakpoint => {
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  return 'sm';
};

/**
 * Tracks the current Tailwind-aligned breakpoint based on window width.
 * - sm: < 768px
 * - md: >= 768px and < 1024px
 * - lg: >= 1024px
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'sm';
    return getBreakpoint(window.innerWidth);
  });

  const update = useCallback(() => {
    setBreakpoint(getBreakpoint(window.innerWidth));
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg',
    colCount: breakpoint === 'lg' ? 3 : breakpoint === 'md' ? 2 : 1,
  } as const;
};

export default useBreakpoint;
