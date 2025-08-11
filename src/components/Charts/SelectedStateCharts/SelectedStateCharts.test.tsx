import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectedStateCharts from './SelectedStateCharts';
import { BlockbusterData } from '@types';

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

describe('SelectedStateCharts', () => {
  const mockData: BlockbusterData = {
    states: {
      CA: {
        score: 85,
        components: {
          AMAZON: 80,
          CENSUS: 90,
          WALMART: 70,
        },
      },
      NY: {
        score: 75,
        components: {
          AMAZON: 70,
          CENSUS: 80,
          WALMART: 60,
        },
      },
      TX: {
        score: 65,
        components: {},
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with state name and all three chart types', () => {
      render(
        <SelectedStateCharts data={mockData} stateCode="CA" showTitle={true} />,
      );

      expect(screen.getByText('California')).toBeInTheDocument();
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });

    it('renders without title when showTitle is false', () => {
      render(
        <SelectedStateCharts
          data={mockData}
          stateCode="CA"
          showTitle={false}
        />,
      );

      const title = screen.getByText('California');
      expect(title).toHaveClass('hidden');
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });

    it('renders with default showTitle value', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const title = screen.getByText('California');
      expect(title).toHaveClass('hidden');
    });
  });

  describe('Chart data passing', () => {
    it('passes correct components data to Radar chart', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 80,
        CENSUS: 90,
        WALMART: 70,
      });
    });

    it('passes correct components data to Bars chart', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const barsChart = screen.getByTestId('bars-chart');
      const components = JSON.parse(
        barsChart.getAttribute('data-components') || '{}',
      );
      const title = barsChart.getAttribute('data-title');

      expect(components).toEqual({
        AMAZON: 80,
        CENSUS: 90,
        WALMART: 70,
      });
      expect(title).toBe('Signal Scores');
    });

    it('passes correct components data to Weighted chart', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const weightedChart = screen.getByTestId('weighted-chart');
      const components = JSON.parse(
        weightedChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 80,
        CENSUS: 90,
        WALMART: 70,
      });
    });
  });

  describe('State data handling', () => {
    it('handles different state codes correctly', () => {
      render(<SelectedStateCharts data={mockData} stateCode="NY" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({
        AMAZON: 70,
        CENSUS: 80,
        WALMART: 60,
      });
    });

    it('handles state with no components data', () => {
      render(<SelectedStateCharts data={mockData} stateCode="TX" />);

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles state with empty components object', () => {
      const mockDataWithEmptyComponents = {
        states: {
          ...mockData.states,
          TX: { score: 65, components: {} },
        },
      };

      render(
        <SelectedStateCharts
          data={mockDataWithEmptyComponents}
          stateCode="TX"
        />,
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
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const container = screen.getByTestId('radar-chart').closest('div')
        ?.parentElement?.parentElement?.parentElement;
      expect(container).toHaveClass(
        'w-full flex flex-col items-center justify-center mt-3 lg:mt-20',
      );
    });

    it('applies correct title classes when showTitle is true', () => {
      render(
        <SelectedStateCharts data={mockData} stateCode="CA" showTitle={true} />,
      );

      const title = screen.getByText('California');
      expect(title).toHaveClass(
        'block hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8',
      );
    });

    it('applies correct title classes when showTitle is false', () => {
      render(
        <SelectedStateCharts
          data={mockData}
          stateCode="CA"
          showTitle={false}
        />,
      );

      const title = screen.getByText('California');
      expect(title).toHaveClass(
        'hidden hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8',
      );
    });

    it('applies correct chart container classes', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const chartContainers = screen.getAllByTestId(/chart$/);
      chartContainers.forEach((container) => {
        const parent = container.parentElement;
        expect(parent).toHaveClass('p-0 max-w-[340px] md:max-w-[360px]');
      });
    });

    it('applies correct charts wrapper classes', () => {
      render(<SelectedStateCharts data={mockData} stateCode="CA" />);

      const chartsWrapper = screen.getByTestId('radar-chart').closest('div')
        ?.parentElement?.parentElement;
      expect(chartsWrapper).toHaveClass(
        'w-full flex flex-wrap gap-8 justify-center',
      );
    });
  });

  describe('State name resolution', () => {
    it('resolves state code to correct state name', () => {
      render(
        <SelectedStateCharts data={mockData} stateCode="CA" showTitle={true} />,
      );

      expect(screen.getByText('California')).toBeInTheDocument();
    });

    it('resolves different state codes to correct names', () => {
      render(
        <SelectedStateCharts data={mockData} stateCode="NY" showTitle={true} />,
      );

      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('handles state code that exists in StateNames', () => {
      render(
        <SelectedStateCharts data={mockData} stateCode="TX" showTitle={true} />,
      );

      expect(screen.getByText('Texas')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles state with undefined components', () => {
      const mockDataWithUndefinedComponents = {
        states: {
          ...mockData.states,
          TX: { score: 65, components: undefined as any },
        },
      };

      render(
        <SelectedStateCharts
          data={mockDataWithUndefinedComponents}
          stateCode="TX"
        />,
      );

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles state with null components', () => {
      const mockDataWithNullComponents = {
        states: {
          ...mockData.states,
          TX: { score: 65, components: null as any },
        },
      };

      render(
        <SelectedStateCharts
          data={mockDataWithNullComponents}
          stateCode="TX"
        />,
      );

      const radarChart = screen.getByTestId('radar-chart');
      const components = JSON.parse(
        radarChart.getAttribute('data-components') || '{}',
      );

      expect(components).toEqual({});
    });

    it('handles empty string state code', () => {
      render(<SelectedStateCharts data={mockData} stateCode="" />);

      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });

    it('handles state code that does not exist in data', () => {
      render(<SelectedStateCharts data={mockData} stateCode="ZZ" />);

      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bars-chart')).toBeInTheDocument();
      expect(screen.getByTestId('weighted-chart')).toBeInTheDocument();
    });
  });

  describe('Data structure handling', () => {
    it('handles data with missing states property', () => {
      const mockDataWithoutStates = {} as BlockbusterData;

      render(
        <SelectedStateCharts data={mockDataWithoutStates} stateCode="CA" />,
      );

      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });

    it('handles data with empty states object', () => {
      const mockDataWithEmptyStates = { states: {} } as BlockbusterData;

      render(
        <SelectedStateCharts data={mockDataWithEmptyStates} stateCode="CA" />,
      );

      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });
  });
});
