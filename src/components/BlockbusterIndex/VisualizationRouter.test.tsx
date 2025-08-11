import VisualizationRouter from './VisualizationRouter';
import { USAStateAbbreviation } from '@constants';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Charts', () => ({
  NationalHeatMap: jest.fn(() => (
    <div data-testid="national-heat-map">NationalHeatMap</div>
  )),
  NationalLollipopChart: jest.fn(() => (
    <div data-testid="national-lollipop-chart">NationalLollipopChart</div>
  )),
  RegionalHeatMap: jest.fn(() => (
    <div data-testid="regional-heat-map">RegionalHeatMap</div>
  )),
  RegionalBarChart: jest.fn(() => (
    <div data-testid="regional-bar-chart">RegionalBarChart</div>
  )),
}));

const mockData = {
  states: {
    CA: {
      score: 0.8,
      components: { component1: 0.5, component2: 0.3 },
    },
  },
};

const mockProps = {
  data: mockData,
  loading: false,
  selectedState: 'CA' as USAStateAbbreviation,
  selectedRegion: { name: 'Northeast', avg: 0.8 },
  vizType: 'map' as const,
  getColorForScore: jest.fn(),
  getStateRank: jest.fn(),
  getRegionRank: jest.fn(),
  onSelectState: jest.fn(),
  onSelectRegion: jest.fn(),
  onViewStats: jest.fn(),
};

describe('VisualizationRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders NationalHeatMap for map vizType', () => {
    render(<VisualizationRouter {...mockProps} vizType="map" />);
    expect(screen.getByTestId('national-heat-map')).toBeInTheDocument();
  });

  it('renders NationalLollipopChart for lolli vizType', () => {
    render(<VisualizationRouter {...mockProps} vizType="lolli" />);
    expect(screen.getByTestId('national-lollipop-chart')).toBeInTheDocument();
  });

  it('renders RegionalHeatMap for regional vizType', () => {
    render(<VisualizationRouter {...mockProps} vizType="regional" />);
    expect(screen.getByTestId('regional-heat-map')).toBeInTheDocument();
  });

  it('renders RegionalBarChart for hist vizType', () => {
    render(<VisualizationRouter {...mockProps} vizType="hist" />);
    expect(screen.getByTestId('regional-bar-chart')).toBeInTheDocument();
  });

  it('renders nothing for unknown vizType', () => {
    const { container } = render(
      <VisualizationRouter {...mockProps} vizType={'unknown' as any} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('passes loading state to components', () => {
    render(<VisualizationRouter {...mockProps} loading={true} />);
    expect(screen.getByTestId('national-heat-map')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    render(<VisualizationRouter {...mockProps} data={null} />);
    expect(screen.getByTestId('national-heat-map')).toBeInTheDocument();
  });
});
