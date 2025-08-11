import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegionalBarChart from './RegionalBarChart';

jest.mock('@components/Charts', () => ({
  Badge: jest.fn(({ data, variant, onViewStats }) => (
    <button data-testid={`badge-${variant}`} onClick={onViewStats}>
      {data
        ? `${data.name}-${data.rank}-${data.score}-${data.type}`
        : 'no-data'}
    </button>
  )),
}));

jest.mock('./RegionalBars', () => ({
  __esModule: true,
  default: jest.fn(({ onSelectRegion, className }) => (
    <div>
      <div data-testid="regional-bars" className={className}>
        regional bars
      </div>
      <button
        data-testid="regional-bars-select"
        onClick={() => onSelectRegion('Selected Region From Bars')}
      >
        select region
      </button>
    </div>
  )),
}));

describe('RegionalBarChart', () => {
  const mockGetRegionRank = jest.fn().mockImplementation((name) => {
    return name === 'West' ? 2 : 0;
  });
  const mockOnSelectRegion = jest.fn();
  const mockOnViewStats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders RegionalBars and does not render Badge when selectedRegion is null', () => {
    render(
      <RegionalBarChart
        getRegionRank={mockGetRegionRank}
        onSelectRegion={mockOnSelectRegion}
        onViewStats={mockOnViewStats}
        selectedRegion={null}
      />,
    );

    expect(screen.getByTestId('regional-bars')).toBeInTheDocument();

    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-default')).not.toBeInTheDocument();
  });

  it('renders badges when selectedRegion is provided and builds badgeData correctly', () => {
    render(
      <RegionalBarChart
        getRegionRank={mockGetRegionRank}
        onSelectRegion={mockOnSelectRegion}
        onViewStats={mockOnViewStats}
        selectedRegion={{ name: 'West', avg: 0.88 }}
      />,
    );

    expect(mockGetRegionRank).toHaveBeenCalledWith('West');

    expect(screen.getByTestId('badge-mobile')).toHaveTextContent(
      'West-2-0.88-region',
    );
    expect(screen.getByTestId('badge-default')).toHaveTextContent(
      'West-2-0.88-region',
    );

    fireEvent.click(screen.getByTestId('badge-mobile'));
    fireEvent.click(screen.getByTestId('badge-default'));
    expect(mockOnViewStats).toHaveBeenCalledTimes(2);
  });

  it('passes through onSelectRegion from RegionalBars to parent handler', () => {
    render(
      <RegionalBarChart
        getRegionRank={mockGetRegionRank}
        onSelectRegion={mockOnSelectRegion}
        onViewStats={mockOnViewStats}
        selectedRegion={null}
      />,
    );

    fireEvent.click(screen.getByTestId('regional-bars-select'));

    expect(mockOnSelectRegion).toHaveBeenCalledWith(
      'Selected Region From Bars',
    );
  });

  it('handles selectedRegion with empty name and zero avg (still truthy -> shows badges)', () => {
    render(
      <RegionalBarChart
        getRegionRank={mockGetRegionRank}
        onSelectRegion={mockOnSelectRegion}
        onViewStats={mockOnViewStats}
        selectedRegion={{ name: '', avg: 0 }}
      />,
    );

    expect(mockGetRegionRank).toHaveBeenCalledWith('');

    expect(screen.getByTestId('badge-mobile')).toHaveTextContent('-0-0-region');
  });
});
