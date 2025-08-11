import React from 'react';
import RegionalBars from './RegionalBars';
import { render, screen } from '@testing-library/react';

jest.mock('../../../providers', () => ({
  useBlockbusterData: jest.fn(),
}));

const mockBar = jest.fn((_props) => <div data-testid="bar-chart" />);

jest.mock('react-chartjs-2', () => ({
  Bar: (_props: any) => mockBar(_props),
}));

const { useBlockbusterData } = require('../../../providers');

describe('RegionalBars', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with no regionAverages (empty branch)', () => {
    useBlockbusterData.mockReturnValue({ regionAverages: [] });

    render(<RegionalBars className="test-class" />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

    const props = mockBar.mock.calls[0][0];
    expect(props.data.labels).toEqual([]);
    expect(props.data.datasets[0].data).toEqual([]);

    expect(props.options.scales.y.min).toBe(0);
    expect(props.options.scales.y.max).toBe(100);

    props.options.onClick({}, []);
    props.options.onHover({}, []);
  });

  it('renders with regionAverages and triggers onClick with index', () => {
    const onSelectRegion = jest.fn();
    const regionAverages = [
      { name: 'Region1', avg: 10 },
      { name: 'Region2', avg: 20 },
    ];
    useBlockbusterData.mockReturnValue({ regionAverages });

    render(<RegionalBars onSelectRegion={onSelectRegion} />);

    const props = mockBar.mock.calls[0][0];

    expect(props.data.labels).toEqual(['Region1', 'Region2']);
    expect(props.data.datasets[0].data).toEqual([10, 20]);

    expect(props.options.scales.y.min).toBeLessThanOrEqual(10);
    expect(props.options.scales.y.max).toBeGreaterThanOrEqual(20);

    props.options.onClick({}, [{ index: 1 }]);
    expect(onSelectRegion).toHaveBeenCalledWith('Region2', 20);

    props.options.onClick({}, [{ _index: 0 }]);
    expect(onSelectRegion).toHaveBeenCalledWith('Region1', 10);

    const mockEl = document.createElement('div');
    props.options.onHover({ native: { target: mockEl } }, [{}]);
    expect(mockEl.style.cursor).toBe('pointer');

    props.options.onHover({ native: { target: mockEl } }, []);
    expect(mockEl.style.cursor).toBe('default');
  });

  it('tooltip label callback formats correctly', () => {
    const regionAverages = [{ name: 'RegionX', avg: 42.1234 }];
    useBlockbusterData.mockReturnValue({ regionAverages });

    render(<RegionalBars />);

    const props = mockBar.mock.calls[0][0];
    const tooltipLabel = props.options.plugins.tooltip.callbacks.label;
    const labelText = tooltipLabel({
      dataIndex: 0,
      parsed: { y: 42.1234 },
    });
    expect(labelText).toBe('RegionX: 42.12');

    const tooltipTitle = props.options.plugins.tooltip.callbacks.title;
    expect(tooltipTitle()).toBe('');
  });

  it('onClick does nothing if onSelectRegion not provided', () => {
    const regionAverages = [{ name: 'NoHandler', avg: 5 }];
    useBlockbusterData.mockReturnValue({ regionAverages });

    render(<RegionalBars />);

    const props = mockBar.mock.calls[0][0];

    props.options.onClick({}, [{ index: 0 }]);
  });
});
