import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock fetch globally for tests.

global.fetch = jest.fn();

// jsdom does not always provide crypto.randomUUID.

if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {},
    writable: true,
  });
}
if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: (): `${string}-${string}-${string}-${string}-${string}` =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as `${string}-${string}-${string}-${string}-${string}`,
    writable: true,
  });
}

// Lightweight mock for chart.js so ChartJS.register calls succeed.

jest.mock('chart.js', () => {
  const Chart = { register: jest.fn() };
  return {
    Chart,
    CategoryScale: {},
    LinearScale: {},
    BarElement: {},
    RadialLinearScale: {},
    PointElement: {},
    LineElement: {},
    Filler: {},
    Tooltip: {},
    Legend: {},
    ScatterController: {},
    Scale: {},
  };
});

// Do NOT mock react-chartjs-2 globally. Tests will mock it per-file to inspect props.
