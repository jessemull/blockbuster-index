import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import NationalHeatMap from './NationalHeatMap';

jest.mock('@components/Charts', () => ({
  GradientLegend: jest.fn(() => <div data-testid="gradient-legend" />),
  Badge: jest.fn(({ data, variant, onViewStats }) => (
    <button data-testid={`badge-${variant}`} onClick={onViewStats}>
      {data.stateCode}-{data.rank}-{data.score}
    </button>
  )),
}));

jest.mock('./NationalMapView', () => ({
  NationalMapView: jest.fn(({ onSelectState, selectedState, loading }) => (
    <div>
      <button data-testid="map-state" onClick={() => onSelectState('TX')}>
        Map State
      </button>
      <div data-testid="map-selected">
        {selectedState || 'none'}-{loading ? 'loading' : 'ready'}
      </div>
    </div>
  )),
}));

describe('NationalHeatMap', () => {
  const data = {
    states: {
      TX: { score: 72, components: {} },
    },
  } as any;

  const baseProps = {
    data,
    getColorForScore: jest.fn(() => '#000'),
    getStateRank: jest.fn(() => 3),
    loading: false,
    onSelectState: jest.fn(),
    onViewStats: jest.fn(),
    selectedState: null as null | 'TX',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders legend and map without badge when nothing selected', () => {
    render(<NationalHeatMap {...baseProps} />);
    expect(screen.getByTestId('gradient-legend')).toBeInTheDocument();
    expect(screen.getByTestId('map-selected')).toHaveTextContent('none-ready');
    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
  });

  it('renders badges when a state is selected', () => {
    render(<NationalHeatMap {...baseProps} selectedState="TX" />);
    expect(screen.getByTestId('badge-mobile')).toHaveTextContent('TX-3-72');
    expect(screen.getByTestId('badge-default')).toHaveTextContent('TX-3-72');
  });

  it('forwards map selection', () => {
    render(<NationalHeatMap {...baseProps} />);
    fireEvent.click(screen.getByTestId('map-state'));
    expect(baseProps.onSelectState).toHaveBeenCalledWith('TX');
  });
});
