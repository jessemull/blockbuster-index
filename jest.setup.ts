import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock fetch globally for tests
global.fetch = jest.fn();

// Lightweight mock for chart.js so ChartJS.register calls succeed
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
  };
});

// Do NOT mock react-chartjs-2 globally. Tests will mock it per-file to inspect props.
