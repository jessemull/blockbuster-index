import Lollipop from './Lollipop';
import React from 'react';
import { render } from '@testing-library/react';

const mockChart = jest.fn((_props) => <div data-testid="chart" />);

jest.mock('react-chartjs-2', () => ({
  Chart: (_props: any) => {
    mockChart(_props);
    return <div data-testid="chart" />;
  },
}));

describe('Lollipop', () => {
  const originalInnerWidth = global.innerWidth;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.innerWidth = originalInnerWidth;
  });

  it('renders with data and handles onClick', () => {
    const handleSelect = jest.fn();
    global.innerWidth = 1024;
    const scores = { CA: 90, NY: 80, TX: 85 };
    render(
      <Lollipop
        scoresByState={scores}
        onSelectState={handleSelect}
        className="test-class"
      />,
    );

    const chartProps = mockChart.mock.calls[0][0];
    expect(chartProps.data.labels).toEqual(['CA', 'TX', 'NY']);
    expect(chartProps.data.datasets[0].data).toEqual([90, 85, 80]);
    expect(chartProps.data.datasets[1].pointRadius).toBe(3);

    chartProps.options.onClick({}, [{ index: 1 }]);
    expect(handleSelect).toHaveBeenCalledWith('TX');

    chartProps.options.onClick({}, []);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('renders with empty scores (min=0, max=100)', () => {
    global.innerWidth = 500;
    render(<Lollipop scoresByState={{}} />);

    const chartProps = mockChart.mock.calls[0][0];
    expect(chartProps.data.labels).toEqual([]);
    expect(chartProps.options.scales.y.min).toBe(0);
    expect(chartProps.options.scales.y.max).toBe(100);
    expect(chartProps.data.datasets[1].pointRadius).toBe(0.5);
  });

  it('handles hover to change cursor', () => {
    render(<Lollipop scoresByState={{ CA: 50 }} />);
    const chartProps = mockChart.mock.calls[0][0];
    const target = { style: { cursor: '' } };

    chartProps.options.onHover({ native: { target } }, [{ index: 0 }]);
    expect(target.style.cursor).toBe('pointer');

    chartProps.options.onHover({ native: { target } }, []);
    expect(target.style.cursor).toBe('default');

    chartProps.options.onHover({}, []);
  });

  it('covers branch where max <= min', () => {
    render(<Lollipop scoresByState={{ CA: 10, TX: 10 }} />);
    const chartProps = mockChart.mock.calls[0][0];
    expect(chartProps.options.scales.y.max).toBeGreaterThan(
      chartProps.options.scales.y.min,
    );
  });

  it('tooltip label callback formats correctly', () => {
    render(<Lollipop scoresByState={{ CA: 12.3456 }} />);
    const chartProps = mockChart.mock.calls[0][0];
    const labelFn = chartProps.options.plugins.tooltip.callbacks.label;
    const text = labelFn({ dataIndex: 0, parsed: { y: 12.3456 } });
    expect(text).toBe('CA: 12.35');
  });
});
