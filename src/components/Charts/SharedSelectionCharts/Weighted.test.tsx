import React from 'react';
import Weighted from './Weighted';
import { SIGNAL_LABELS, SIGNAL_WEIGHTS } from '@constants';
import { render, screen } from '@testing-library/react';

let lastBarProps: any;
jest.mock('react-chartjs-2', () => {
  const React = require('react');
  return {
    Bar: (props: any) => {
      lastBarProps = props;
      return React.createElement('div', { 'data-testid': 'bar-chart' });
    },
  };
});

describe('Weighted', () => {
  beforeEach(() => {
    lastBarProps = undefined;
  });

  it('renders title and passes weighted, sorted data to Bar', () => {
    const components = {
      AMAZON: 2,
      CENSUS: 1,
      WALMART: 3,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    labels.forEach((l: string) =>
      expect(Object.values(SIGNAL_LABELS)).toContain(l),
    );

    expect(lastBarProps.options.indexAxis).toBe('y');
    expect(lastBarProps.options.plugins.legend.display).toBe(false);
  });

  it('handles empty components object', () => {
    render(<Weighted components={{}} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    expect(labels.length).toBeGreaterThan(0);
    expect(datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with null/undefined values', () => {
    const components = {
      AMAZON: null,
      CENSUS: undefined,
      WALMART: 30,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    expect(values).toContain(0);
    const walmartWeight = SIGNAL_WEIGHTS.WALMART || 0;
    const expectedWalmartValue = Number((30 * walmartWeight).toFixed(2));
    expect(values).toContain(expectedWalmartValue);
  });

  it('handles components with zero values', () => {
    const components = {
      AMAZON: 0,
      CENSUS: 0,
      WALMART: 0,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    expect(labels.length).toBeGreaterThan(0);
    expect(datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with negative values', () => {
    const components = {
      AMAZON: -10,
      CENSUS: 50,
      WALMART: -5,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    const amazonWeight = SIGNAL_WEIGHTS.AMAZON || 0;
    const censusWeight = SIGNAL_WEIGHTS.CENSUS || 0;
    const walmartWeight = SIGNAL_WEIGHTS.WALMART || 0;

    const expectedAmazonValue = Number((-10 * amazonWeight).toFixed(2));
    const expectedCensusValue = Number((50 * censusWeight).toFixed(2));
    const expectedWalmartValue = Number((-5 * walmartWeight).toFixed(2));

    expect(values).toContain(expectedAmazonValue);
    expect(values).toContain(expectedCensusValue);
    expect(values).toContain(expectedWalmartValue);
  });

  it('handles components with decimal values', () => {
    const components = {
      AMAZON: 10.5,
      CENSUS: 70.25,
      WALMART: 20.75,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    const amazonWeight = SIGNAL_WEIGHTS.AMAZON || 0;
    const censusWeight = SIGNAL_WEIGHTS.CENSUS || 0;
    const walmartWeight = SIGNAL_WEIGHTS.WALMART || 0;

    const expectedAmazonValue = Number((10.5 * amazonWeight).toFixed(2));
    const expectedCensusValue = Number((70.25 * censusWeight).toFixed(2));
    const expectedWalmartValue = Number((20.75 * walmartWeight).toFixed(2));

    expect(values).toContain(expectedAmazonValue);
    expect(values).toContain(expectedCensusValue);
    expect(values).toContain(expectedWalmartValue);
  });

  it('handles components with string values that can be converted to numbers', () => {
    const components = {
      AMAZON: '15',
      CENSUS: '60',
      WALMART: '25',
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    const amazonWeight = SIGNAL_WEIGHTS.AMAZON || 0;
    const censusWeight = SIGNAL_WEIGHTS.CENSUS || 0;
    const walmartWeight = SIGNAL_WEIGHTS.WALMART || 0;

    const expectedAmazonValue = Number((15 * amazonWeight).toFixed(2));
    const expectedCensusValue = Number((60 * censusWeight).toFixed(2));
    const expectedWalmartValue = Number((25 * walmartWeight).toFixed(2));

    expect(values).toContain(expectedAmazonValue);
    expect(values).toContain(expectedCensusValue);
    expect(values).toContain(expectedWalmartValue);
  });

  it('handles single component', () => {
    const components = { AMAZON: 100 } as any;
    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    expect(labels.length).toBeGreaterThan(0);

    const amazonWeight = SIGNAL_WEIGHTS.AMAZON || 0;
    const expectedValue = Number((100 * amazonWeight).toFixed(2));
    expect(datasets[0].data).toContain(expectedValue);
  });

  it('handles components with very large values', () => {
    const components = {
      AMAZON: 999999,
      CENSUS: 1000000,
      WALMART: 888888,
    } as any;

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;
    expect(values.length).toBe(labels.length);

    const amazonWeight = SIGNAL_WEIGHTS.AMAZON || 0;
    const censusWeight = SIGNAL_WEIGHTS.CENSUS || 0;
    const walmartWeight = SIGNAL_WEIGHTS.WALMART || 0;

    const expectedAmazonValue = Number((999999 * amazonWeight).toFixed(2));
    const expectedCensusValue = Number((1000000 * censusWeight).toFixed(2));
    const expectedWalmartValue = Number((888888 * walmartWeight).toFixed(2));

    expect(values).toContain(expectedAmazonValue);
    expect(values).toContain(expectedCensusValue);
    expect(values).toContain(expectedWalmartValue);
  });

  it('handles components with missing signal keys', () => {
    const components = {
      AMAZON: 50,
      UNKNOWN_SIGNAL: 30,
    };

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels } = lastBarProps.data;
    expect(labels).toContain('Amazon');
    expect(labels).not.toContain('UNKNOWN_SIGNAL');
  });

  it('handles components with zero weights', () => {
    const components = {
      AMAZON: 100,
      CENSUS: 50,
    };

    render(<Weighted components={components} />);

    expect(screen.getByText('Signal Contributions')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { labels } = lastBarProps.data;
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders component structure correctly', () => {
    const components = { AMAZON: 50 };
    render(<Weighted components={components} />);

    const container = screen.getByText('Signal Contributions').closest('div');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
