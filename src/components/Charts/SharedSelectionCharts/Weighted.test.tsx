import React from 'react';
import { render, screen } from '@testing-library/react';
import Weighted from './Weighted';
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
});
