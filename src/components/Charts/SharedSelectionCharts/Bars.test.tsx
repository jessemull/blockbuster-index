import Bars from './Bars';
import React from 'react';
import { SIGNAL_LABELS } from '@constants';
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

describe('Bars', () => {
  beforeEach(() => {
    lastBarProps = undefined;
  });

  it('renders with provided title and passes sorted data to Bar', () => {
    const components = {
      AMAZON: 10,
      CENSUS: 70,
      WALMART: 20,
    } as any;

    render(<Bars components={components} title="Signal Scores" />);

    expect(screen.getByText('Signal Scores')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { _labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;

    expect(values.slice(0, 3)).toEqual([70, 20, 10]);
    expect(values.slice(3).every((v) => v === 0)).toBe(true);

    const expectedLabels = [
      SIGNAL_LABELS.CENSUS,
      SIGNAL_LABELS.WALMART,
      SIGNAL_LABELS.AMAZON,
    ];

    expect(lastBarProps.data.labels.slice(0, 3)).toEqual(expectedLabels);
    expect(lastBarProps.options.indexAxis).toBe('y');
    expect(lastBarProps.options.plugins.legend.display).toBe(false);
  });

  it('uses default title when none is provided', () => {
    render(<Bars components={{}} />);
    expect(screen.getByText('Signal Scores')).toBeInTheDocument();
  });

  it('handles empty components object', () => {
    render(<Bars components={{}} title="Empty Data" />);

    expect(screen.getByText('Empty Data')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { _labels, datasets } = lastBarProps.data;
    expect(lastBarProps.data.labels.length).toBeGreaterThan(0);
    expect(datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with null/undefined values', () => {
    const components = {
      AMAZON: null,
      CENSUS: undefined,
      WALMART: 30,
    } as any;

    render(<Bars components={components} title="Mixed Data" />);

    expect(screen.getByText('Mixed Data')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { _labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;

    expect(values).toContain(0);
    expect(values).toContain(30);
  });

  it('handles components with zero values', () => {
    const components = {
      AMAZON: 0,
      CENSUS: 0,
      WALMART: 0,
    } as any;

    render(<Bars components={components} title="Zero Values" />);

    expect(screen.getByText('Zero Values')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { datasets } = lastBarProps.data;
    expect(datasets[0].data.every((v: number) => v === 0)).toBe(true);
  });

  it('handles components with negative values', () => {
    const components = {
      AMAZON: -10,
      CENSUS: 50,
      WALMART: -5,
    } as any;

    render(<Bars components={components} title="Negative Values" />);

    expect(screen.getByText('Negative Values')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;

    expect(values[0]).toBe(50);
    expect(values).toContain(-5);
    expect(values).toContain(-10);
  });

  it('handles components with decimal values', () => {
    const components = {
      AMAZON: 10.5,
      CENSUS: 70.25,
      WALMART: 20.75,
    } as any;

    render(<Bars components={components} title="Decimal Values" />);

    expect(screen.getByText('Decimal Values')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;

    expect(values[0]).toBe(70.25);
    expect(values[1]).toBe(20.75);
    expect(values[2]).toBe(10.5);
  });

  it('handles components with string values that can be converted to numbers', () => {
    const components = {
      AMAZON: '15',
      CENSUS: '60',
      WALMART: '25',
    } as any;

    render(<Bars components={components} title="String Values" />);

    expect(screen.getByText('String Values')).toBeInTheDocument();
    expect(lastBarProps).toBeDefined();

    const { datasets } = lastBarProps.data;
    const values: any[] = datasets[0].data;

    expect(values).toContain('15');
    expect(values).toContain('25');
    expect(values).toContain('60');
  });

  it('renders component structure correctly', () => {
    const components = { AMAZON: 50 };
    render(<Bars components={components} />);

    const container = screen.getByText('Signal Scores').closest('div');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
