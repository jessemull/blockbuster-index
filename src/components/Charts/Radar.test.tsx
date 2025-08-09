import React from 'react';
import { render, screen } from '@testing-library/react';
import Radar from './Radar';

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
  });
});
