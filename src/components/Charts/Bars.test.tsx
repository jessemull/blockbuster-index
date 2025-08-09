import React from 'react';
import { render, screen } from '@testing-library/react';
import Bars from './Bars';
import { SIGNAL_LABELS } from '@constants';

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

    const { labels, datasets } = lastBarProps.data;
    const values: number[] = datasets[0].data;

    expect(values.slice(0, 3)).toEqual([70, 20, 10]);
    expect(values.slice(3).every((v) => v === 0)).toBe(true);

    const expectedLabels = [
      SIGNAL_LABELS.CENSUS,
      SIGNAL_LABELS.WALMART,
      SIGNAL_LABELS.AMAZON,
    ];
    expect(labels.slice(0, 3)).toEqual(expectedLabels);

    // options smoke check
    expect(lastBarProps.options.indexAxis).toBe('y');
    expect(lastBarProps.options.plugins.legend.display).toBe(false);
  });

  it('uses default title when none is provided', () => {
    render(<Bars components={{}} />);
    expect(screen.getByText('Signal Scores')).toBeInTheDocument();
  });
});
