import React from 'react';
import RegionalHeatMap from './RegionalHeatMap';
import { USAStateAbbreviation } from '@constants';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@components/Charts', () => ({
  GradientLegend: jest.fn(() => <div data-testid="gradient-legend" />),
  Badge: jest.fn(({ data, variant, onViewStats }) => (
    <button data-testid={`badge-${variant}`} onClick={onViewStats}>
      {data.name}-{data.rank}-{data.score}-{data.type}
    </button>
  )),
}));

jest.mock('./RegionalMapView', () => ({
  RegionalMapView: jest.fn(
    ({ onSelectRegion, onSelectState, selectedRegion, selectedState }) => (
      <div>
        <button
          data-testid="map-region"
          onClick={() => onSelectRegion('Test Region')}
        >
          Map Region
        </button>
        <button data-testid="map-state" onClick={() => onSelectState('CA')}>
          Map State
        </button>
        <div data-testid="map-selected">
          {selectedRegion || 'no-region'}-{selectedState || 'no-state'}
        </div>
      </div>
    ),
  ),
}));

describe('RegionalHeatMap', () => {
  const mockGetColorForScore = jest.fn();
  const mockGetRegionRank = jest
    .fn()
    .mockImplementation((name) => (name ? 5 : 0));
  const mockOnSelectRegion = jest.fn();
  const mockOnSelectState = jest.fn();
  const mockOnViewStats = jest.fn();

  const baseProps = {
    data: { dummy: true } as any,
    getColorForScore: mockGetColorForScore,
    getRegionRank: mockGetRegionRank,
    onSelectRegion: mockOnSelectRegion,
    onSelectState: mockOnSelectState,
    onViewStats: mockOnViewStats,
    selectedState: null as USAStateAbbreviation | null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without selectedRegion and does not render Badge', () => {
    render(<RegionalHeatMap {...baseProps} selectedRegion={null} />);

    expect(screen.getByTestId('gradient-legend')).toBeInTheDocument();
    expect(screen.getByTestId('map-selected')).toHaveTextContent(
      'no-region-no-state',
    );

    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-default')).not.toBeInTheDocument();
  });

  it('renders with selectedRegion and passes correct badgeData', () => {
    render(
      <RegionalHeatMap
        {...baseProps}
        selectedRegion={{ name: 'West', avg: 0.75 }}
        selectedState="OR"
      />,
    );

    expect(screen.getByTestId('badge-mobile')).toHaveTextContent(
      'West-5-0.75-region',
    );
    expect(screen.getByTestId('badge-default')).toHaveTextContent(
      'West-5-0.75-region',
    );

    fireEvent.click(screen.getByTestId('map-region'));
    expect(mockOnSelectRegion).toHaveBeenCalledWith('Test Region');

    fireEvent.click(screen.getByTestId('map-state'));
    expect(mockOnSelectState).toHaveBeenCalledWith('CA');

    fireEvent.click(screen.getByTestId('badge-mobile'));
    fireEvent.click(screen.getByTestId('badge-default'));
    expect(mockOnViewStats).toHaveBeenCalledTimes(2);
  });

  it('handles selectedRegion with missing name and avg', () => {
    render(
      <RegionalHeatMap {...baseProps} selectedRegion={{ name: '', avg: 0 }} />,
    );

    expect(screen.getByTestId('badge-mobile')).toHaveTextContent('-0-0-region');
  });
});
