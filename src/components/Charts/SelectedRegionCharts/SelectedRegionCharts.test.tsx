import React from 'react';
import SelectedRegionCharts from './SelectedRegionCharts';
import { BlockbusterData } from '@types';
import { render, screen } from '@testing-library/react';

const mockUseBlockbusterData = {
  regionComponentsAverageByName: {
    Northeast: {
      AMAZON: 75,
      CENSUS: 85,
      WALMART: 65,
    },
    Southeast: {
      AMAZON: 60,
      CENSUS: 70,
      WALMART: 80,
    },
  },
};

jest.mock('../../../providers/BlockbusterDataProvider', () => ({
  useBlockbusterData: () => mockUseBlockbusterData,
}));

jest.mock('../SharedSelectionCharts', () => ({
  Bars: ({ components, title }: any) => (
    <div
      data-testid="bars-chart"
      data-components={JSON.stringify(components)}
      data-title={title}
    >
      Bars Chart
    </div>
  ),
  Radar: ({ components }: any) => (
    <div data-testid="radar-chart" data-components={JSON.stringify(components)}>
      Radar Chart
    </div>
  ),
  Weighted: ({ components }: any) => (
    <div
      data-testid="weighted-chart"
      data-components={JSON.stringify(components)}
    >
      Weighted Chart
    </div>
  ),
}));

describe('SelectedRegionCharts', () => {
  const mockData: BlockbusterData = {
    states: {
      CA: { score: 85, components: { AMAZON: 80, CENSUS: 90, WALMART: 70 } },
      NY: { score: 75, components: { AMAZON: 70, CENSUS: 80, WALMART: 60 } },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with region name and all three chart types', () => {
      render(
        <SelectedRegionCharts
          data={mockData}
          regionName="Northeast"
          showTitle={true}
        />,
      );

      expect(screen.getByText('Northeast')).toBeInTheDocument();
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });

    it('renders without title when showTitle is false', () => {
      render(
        <SelectedRegionCharts
          data={mockData}
          regionName="Northeast"
          showTitle={false}
        />,
      );

      const title = screen.getByText('Northeast');
      expect(title).toHaveClass('hidden');
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });

    it('renders with default showTitle value', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const title = screen.getByText('Northeast');
      expect(title).toHaveClass('hidden');
    });
  });

  describe('Chart data passing', () => {
    it('passes correct components data to Radar chart', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 75,
        CENSUS: 85,
        WALMART: 65,
      });
    });

    it('passes correct components data to Bars chart', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const barsChart = screen.getByTestId('bars-chart');
      const components = JSON.parse(
        barsChart.getAttribute('data-components') || '{}',
      );
      const title = barsChart.getAttribute('data-title');

      expect(components).toEqual({
        AMAZON: 75,
        CENSUS: 85,
        WALMART: 65,
      });
      expect(title).toBe('Signal Scores');
    });

    it('passes correct components data to Weighted chart', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const weightedChart = screen.getByTestId('weighted-chart');
      const components = JSON.parse(
        weightedChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 75,
        CENSUS: 85,
        WALMART: 65,
      });
    });
  });

  describe('Region data handling', () => {
    it('handles different region names correctly', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Southeast" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 60,
        CENSUS: 70,
        WALMART: 80,
      });
    });

    it('handles region with no components data', () => {
      render(
        <SelectedRegionCharts data={mockData} regionName="Unknown Region" />,
      );

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles empty region components data', () => {
      const mockDataWithEmptyRegion = {
        ...mockData,
        regionComponentsAverageByName: {
          'Empty Region': {},
        },
      };

      jest.doMock('../../../providers/BlockbusterDataProvider', () => ({
        useBlockbusterData: () => mockDataWithEmptyRegion,
      }));

      render(
        <SelectedRegionCharts data={mockData} regionName="Empty Region" />,
      );

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });
  });

  describe('Styling and layout', () => {
    it('applies correct container classes', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const container = screen.getByTestId('radar-chart').closest('div')
        ?.parentElement?.parentElement?.parentElement;
      expect(container).toHaveClass(
        'w-full flex flex-col items-center justify-center mt-3 lg:mt-20',
      );
    });

    it('applies correct title classes when showTitle is true', () => {
      render(
        <SelectedRegionCharts
          data={mockData}
          regionName="Northeast"
          showTitle={true}
        />,
      );

      const title = screen.getByText('Northeast');
      expect(title).toHaveClass(
        'block hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8',
      );
    });

    it('applies correct title classes when showTitle is false', () => {
      render(
        <SelectedRegionCharts
          data={mockData}
          regionName="Northeast"
          showTitle={false}
        />,
      );

      const title = screen.getByText('Northeast');
      expect(title).toHaveClass(
        'hidden hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8',
      );
    });

    it('applies correct chart container classes', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const chartContainers = screen.getAllByTestId(/chart$/);
      chartContainers.forEach((container) => {
        const parent = container.parentElement;
        expect(parent).toHaveClass('p-0 max-w-[340px] md:max-w-[360px]');
      });
    });

    it('applies correct charts wrapper classes', () => {
      render(<SelectedRegionCharts data={mockData} regionName="Northeast" />);

      const chartsWrapper = screen.getByTestId('radar-chart').closest('div')
        ?.parentElement?.parentElement;
      expect(chartsWrapper).toHaveClass(
        'w-full flex flex-wrap gap-8 justify-center',
      );
    });
  });

  describe('Edge cases', () => {
    it('handles null region components data', () => {
      const mockDataWithNullRegion = {
        ...mockData,
        regionComponentsAverageByName: null,
      };

      jest.doMock('../../../providers/BlockbusterDataProvider', () => ({
        useBlockbusterData: () => mockDataWithNullRegion,
      }));

      render(<SelectedRegionCharts data={mockData} regionName="Test Region" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles undefined region components data', () => {
      const mockDataWithUndefinedRegion = {
        ...mockData,
        regionComponentsAverageByName: undefined,
      };

      jest.doMock('../../../providers/BlockbusterDataProvider', () => ({
        useBlockbusterData: () => mockDataWithUndefinedRegion,
      }));

      render(<SelectedRegionCharts data={mockData} regionName="Test Region" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles empty string region name', () => {
      render(<SelectedRegionCharts data={mockData} regionName="" />);

      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });
  });
});
