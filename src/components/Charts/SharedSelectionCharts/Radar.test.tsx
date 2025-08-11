import Radar from './Radar';
import React from 'react';
import { render, screen } from '@testing-library/react';

let lastRadarProps: any;

jest.mock('react-chartjs-2', () => {
  const React = require('react');
  return {
    Radar: (props: any) => {
      lastRadarProps = props;
      return React.createElement('div', { 'data-testid': 'radar-chart' });
    },
  };
});

describe('Radar', () => {
  beforeEach(() => {
    lastRadarProps = undefined;
  });

  it('renders title and provides dataset to Radar chart', () => {
    const components = { AMAZON: 1, CENSUS: 2 } as any;
    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;

    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);
    expect(lastRadarProps.options.maintainAspectRatio).toBe(false);
    expect(lastRadarProps.options.plugins.legend.display).toBe(false);
  });

  it('handles empty components object', () => {
    render(<Radar components={{}} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);
    expect(data.labels.length).toBeGreaterThan(0);
    expect(data.datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with null/undefined values', () => {
    const components = {
      AMAZON: null,
      CENSUS: undefined,
      WALMART: 30,
    } as any;

    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);

    expect(data.datasets[0].data).toContain(0);
    expect(data.datasets[0].data).toContain(30);
  });

  it('handles components with zero values', () => {
    const components = {
      AMAZON: 0,
      CENSUS: 0,
      WALMART: 0,
    } as any;

    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);
    expect(data.datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with negative values', () => {
    const components = {
      AMAZON: -10,
      CENSUS: 50,
      WALMART: -5,
    } as any;

    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);

    expect(data.datasets[0].data).toContain(-10);
    expect(data.datasets[0].data).toContain(50);
    expect(data.datasets[0].data).toContain(-5);
  });

  it('handles components with decimal values', () => {
    const components = {
      AMAZON: 10.5,
      CENSUS: 70.25,
      WALMART: 20.75,
    } as any;

    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);

    expect(data.datasets[0].data).toContain(10.5);
    expect(data.datasets[0].data).toContain(70.25);
    expect(data.datasets[0].data).toContain(20.75);
  });

  it('handles components with string values that can be converted to numbers', () => {
    const components = {
      AMAZON: '15',
      CENSUS: '60',
      WALMART: '25',
    } as any;

    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);

    expect(data.datasets[0].data).toContain('15');
    expect(data.datasets[0].data).toContain('60');
    expect(data.datasets[0].data).toContain('25');
  });

  it('handles single component', () => {
    const components = { AMAZON: 100 } as any;
    render(<Radar components={components} />);

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
    expect(lastRadarProps).toBeDefined();

    const { data } = lastRadarProps;
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);
    expect(data.labels.length).toBeGreaterThan(0);
    expect(data.datasets[0].data).toContain(100);
  });

  it('renders component structure correctly', () => {
    const components = { AMAZON: 50 };
    render(<Radar components={components} />);

    const container = screen.getByText('Signal Composition').closest('div');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });
});
