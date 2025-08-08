import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock fetch globally for tests
global.fetch = jest.fn();

// Mock chart.js and react-chartjs-2 to avoid requiring canvas in JSDOM
jest.mock('chart.js', () => ({
  Chart: class {},
  registerables: [],
  ChartItem: {},
}));
jest.mock('react-chartjs-2', () => ({
  Radar: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));
