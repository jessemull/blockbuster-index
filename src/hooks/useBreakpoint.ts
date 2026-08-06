import { useSyncExternalStore } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg';

const getBreakpoint = (width: number): Breakpoint => {
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  return 'sm';
};

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener('resize', onStoreChange);
  return () => window.removeEventListener('resize', onStoreChange);
};

const getSnapshot = () => getBreakpoint(window.innerWidth);

const getServerSnapshot = (): Breakpoint => 'sm';

/**
 * Tracks the current Tailwind-aligned breakpoint based on window width.
 * - sm: < 768px
 * - md: >= 768px and < 1024px
 * - lg: >= 1024px
 */
const useBreakpoint = () => {
  const breakpoint = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg',
    colCount: breakpoint === 'lg' ? 3 : breakpoint === 'md' ? 2 : 1,
  } as const;
};

export default useBreakpoint;
