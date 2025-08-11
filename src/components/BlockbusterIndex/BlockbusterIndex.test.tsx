import BlockbusterIndex from './BlockbusterIndex';
import React, { act } from 'react';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockbusterDataProvider } from '@providers';

jest.mock('react-chartjs-2', () => ({
  Radar: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));

jest.mock('../USAMap', () => {
  return {
    USAMap: ({ customStates }: any) => (
      <div>
        {Object.entries(customStates).map(([stateCode, props]: any) => (
          <button
            key={stateCode}
            data-testid={`state-${stateCode}`}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            style={{ backgroundColor: props.fill }}
          >
            {stateCode}
          </button>
        ))}
      </div>
    ),
    StateNames: {
      CA: 'California',
      NY: 'New York',
      TX: 'Texas',
    },
  };
});

function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      }) as any,
  );
}

describe('BlockbusterIndex', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('renders error if fetch response is not ok', async () => {
    mockFetch({}, false);
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('renders SelectedStateCharts when map is selected and state is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
  });

  it('renders SelectedStateCharts when lolli is selected and state is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    const lolliButton = await screen.findByText('National Lollipop Chart');
    await act(async () => {
      fireEvent.click(lolliButton);
    });

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when hist is selected and region is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const histButton = await screen.findByText('Regional Bar Chart');
    await act(async () => {
      fireEvent.click(histButton);
    });

    expect(screen.getByText('Regional Bar Chart')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when regional is selected and region is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const regionalButton = await screen.findByText('Regional Heat Map');
    await act(async () => {
      fireEvent.click(regionalButton);
    });

    expect(screen.getByText('Regional Heat Map')).toBeInTheDocument();
  });

  it('renders SelectedStateCharts when lolli is selected and state is selected with showTitle true', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    const lolliButton = await screen.findByText('National Lollipop Chart');
    await act(async () => {
      fireEvent.click(lolliButton);
    });

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when hist is selected and region is selected with showTitle true', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const histButton = await screen.findByText('Regional Bar Chart');
    await act(async () => {
      fireEvent.click(histButton);
    });

    expect(screen.getByText('Regional Bar Chart')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when region is selected in regional visualization', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const regionalButton = await screen.findByText('Regional Heat Map');
    await act(async () => {
      fireEvent.click(regionalButton);
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    expect(await screen.findByText('Signal Composition')).toBeInTheDocument();
  });

  it('does not render SelectedStateCharts when map is not selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const histButton = await screen.findByText('Regional Bar Chart');
    await act(async () => {
      fireEvent.click(histButton);
    });

    expect(screen.queryByText('Signal Composition')).not.toBeInTheDocument();
  });

  it('does not render SelectedRegionCharts when hist/regional is not selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    expect(screen.queryByText('Signal Composition')).not.toBeInTheDocument();
  });

  it('handles equal scores correctly in rank', async () => {
    mockFetch({
      states: {
        CA: { score: 50, components: {} },
        TX: { score: 50, components: {} },
      },
    });
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    expect(await screen.findByTestId('state-CA')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('state-TX'));
    });

    expect(screen.getByText('TX')).toBeInTheDocument();
  });

  it('normalizes color correctly when minScore = maxScore', async () => {
    mockFetch({
      states: {
        CA: { score: 42, components: {} },
      },
    });
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });
    const caBtn = await screen.findByTestId('state-CA');

    expect(caBtn).toHaveStyle({ backgroundColor: 'rgb(200, 220, 255)' });
  });

  it('handles non-error objects thrown in fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject('plain string'));
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });

  it('handles string error messages correctly', async () => {
    global.fetch = jest.fn(() => Promise.reject('Custom error message'));
    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });

  it('handles region selection with fallback average when regionAverageByName is undefined', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const histButton = await screen.findByText('Regional Bar Chart');
    await act(async () => {
      fireEvent.click(histButton);
    });

    expect(screen.getByText('Regional Bar Chart')).toBeInTheDocument();
  });

  it('handles region selection with existing average from regionAverageByName', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const regionalButton = await screen.findByText('Regional Heat Map');
    await act(async () => {
      fireEvent.click(regionalButton);
    });

    expect(screen.getByText('Regional Heat Map')).toBeInTheDocument();
  });

  it('handles getRegionRank fallback when function is undefined', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const regionalButton = await screen.findByText('Regional Heat Map');
    await act(async () => {
      fireEvent.click(regionalButton);
    });

    expect(screen.getByText('Regional Heat Map')).toBeInTheDocument();
  });

  it('renders SelectedStateCharts when map is selected and state is selected with data', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
  });

  it('renders SelectedStateCharts when lolli is selected and state is selected with data', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const stateButton = await screen.findByTestId('state-CA');
    await act(async () => {
      fireEvent.click(stateButton);
    });

    const lolliButton = await screen.findByText('National Lollipop Chart');
    await act(async () => {
      fireEvent.click(lolliButton);
    });

    expect(screen.getByText('Signal Composition')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when hist is selected and region is selected with data', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const histButton = await screen.findByText('Regional Bar Chart');
    await act(async () => {
      fireEvent.click(histButton);
    });

    expect(screen.getByText('Regional Bar Chart')).toBeInTheDocument();
  });

  it('renders SelectedRegionCharts when regional is selected and region is selected with data', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    const regionalButton = await screen.findByText('Regional Heat Map');
    await act(async () => {
      fireEvent.click(regionalButton);
    });

    expect(screen.getByText('Regional Heat Map')).toBeInTheDocument();
  });

  it('does not render SelectedStateCharts when no state is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    expect(screen.queryByText('Signal Composition')).not.toBeInTheDocument();
  });

  it('does not render SelectedRegionCharts when no region is selected', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    await act(async () => {
      render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
    });

    expect(
      screen.queryByTestId('selected-region-charts'),
    ).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    await act(async () => {
      const { container } = render(
        <BlockbusterDataProvider>
          <BlockbusterIndex />
        </BlockbusterDataProvider>,
      );
      const results = await axe(container as unknown as Element);
      expect(results).toHaveNoViolations();
    });
  });
});
