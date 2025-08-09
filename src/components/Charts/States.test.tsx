import React from 'react';
import States from './States';
import { BlockbusterData } from '@types';
import { render } from '@testing-library/react';

jest.mock('react-chartjs-2', () => ({
  Radar: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));

describe('States (layout)', () => {
  it('renders state heading and chart containers', () => {
    const data: BlockbusterData = {
      states: {
        CA: { score: 75, components: { AMAZON: 10 } },
      },
    };

    const { getByText } = render(
      (<States data={data} stateCode="CA" />) as any,
    );
    expect(getByText('California')).toBeInTheDocument();
  });
});
