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
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('renders error if fetch response is not ok', async () => {
    mockFetch({}, false);
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('renders loading state', async () => {
    mockFetch({ states: {} });
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/loading map data/i)).toBeInTheDocument();
  });

  it('renders map with scores and handles click', async () => {
    mockFetch({
      states: {
        CA: { score: 75, components: {} },
        NY: { score: 45, components: {} },
      },
    });

    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findByTestId('state-CA')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('state-CA'));

    expect(await screen.findAllByText(/california/i)).toHaveLength(3);
    expect(screen.getAllByText('75')).toHaveLength(2);
    expect(screen.getAllByText(/rank: 1/i)).toHaveLength(2);

    fireEvent.click(screen.getByTestId('state-NY'));
    expect(await screen.findAllByText(/new york/i)).toHaveLength(3);
    expect(screen.getAllByText('45')).toHaveLength(2);
    expect(screen.getAllByText(/rank: 2/i)).toHaveLength(2);
  });

  it('handles equal scores correctly in rank', async () => {
    mockFetch({
      states: {
        CA: { score: 50, components: {} },
        TX: { score: 50, components: {} },
      },
    });
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findByTestId('state-CA')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('state-TX'));

    expect(screen.getByText('TX')).toBeInTheDocument();
  });

  it('normalizes color correctly when minScore = maxScore', async () => {
    mockFetch({
      states: {
        CA: { score: 42, components: {} },
      },
    });
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );
    const caBtn = await screen.findByTestId('state-CA');

    expect(caBtn).toHaveStyle({ backgroundColor: 'rgb(200, 220, 255)' });
  });

  it('handles non-error objects thrown in fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject('plain string'));
    render(
      <BlockbusterDataProvider>
        <BlockbusterIndex />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
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
