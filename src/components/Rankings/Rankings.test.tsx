import Rankings from './Rankings';
import React from 'react';
import { BlockbusterDataProvider } from '../BlockbusterIndex/BlockbusterDataProvider';
import { render, screen, fireEvent, act } from '@testing-library/react';

function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      }) as any,
  );
}

describe('Rankings', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows loading state', async () => {
    mockFetch({ states: {} });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/loading rankings/i)).toBeInTheDocument();
  });

  it('shows error state', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/fail/i)).toBeInTheDocument();
  });

  it('shows error if fetch not ok', async () => {
    mockFetch({}, false);
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    expect(
      await screen.findByText(/failed to fetch data/i),
    ).toBeInTheDocument();
  });

  it('shows empty state if no states', async () => {
    mockFetch({ states: {} });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    expect(screen.queryByText('California')).not.toBeInTheDocument();
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  it('renders all signals and descriptions', async () => {
    mockFetch({
      states: {
        CA: {
          score: 100,
          components: { AMAZON: 10, CENSUS: 20, BROADBAND: 30, WALMART: 40 },
        },
        NY: {
          score: 90,
          components: { AMAZON: 20, CENSUS: 30, BROADBAND: 40, WALMART: 50 },
        },
        TX: {
          score: 80,
          components: { AMAZON: 30, CENSUS: 40, BROADBAND: 50, WALMART: 60 },
        },
      },
    });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findAllByText(/blockbuster index/i)).toHaveLength(2);
    expect(screen.getByText(/weighted combination/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/select signal/i), {
      target: { value: 'AMAZON' },
    });
    expect(screen.getByText(/amazon job scraping/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/select signal/i), {
      target: { value: 'CENSUS' },
    });
    expect(screen.getByText(/number of retail stores/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/select signal/i), {
      target: { value: 'BROADBAND' },
    });
    expect(screen.getByText(/broadband access/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/select signal/i), {
      target: { value: 'WALMART' },
    });
    expect(
      screen.getByText(/brick-and-mortar walmart jobs/i),
    ).toBeInTheDocument();
  });

  it('renders correct rankings and handles ties', async () => {
    mockFetch({
      states: {
        CA: { score: 100, components: { AMAZON: 10 } },
        NY: { score: 100, components: { AMAZON: 10 } },
        TX: { score: 80, components: { AMAZON: 5 } },
      },
    });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders multiple columns responsively', async () => {
    mockFetch({
      states: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [
          `S${i + 1}`,
          { score: 100 - i, components: { AMAZON: 100 - i } },
        ]),
      ),
    });

    global.innerWidth = 900;
    act(() => window.dispatchEvent(new Event('resize')));
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findAllByRole('table')).toHaveLength(2);

    global.innerWidth = 1200;
    act(() => window.dispatchEvent(new Event('resize')));

    expect(await screen.findAllByRole('table')).toHaveLength(3);
  });

  it('renders table with correct headers and cell alignment', async () => {
    mockFetch({
      states: {
        CA: { score: 100, components: { AMAZON: 10 } },
      },
    });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    expect((await screen.findAllByText('Rank')).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText('State').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Score').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('select field is accessible and interactive', async () => {
    mockFetch({
      states: {
        CA: { score: 100, components: { AMAZON: 10 } },
      },
    });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    const select = await screen.findByLabelText(/select signal/i);
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'AMAZON' } });
    expect(screen.getByText(/amazon job scraping/i)).toBeInTheDocument();
  });

  it('handles missing components gracefully', async () => {
    mockFetch({
      states: {
        CA: { score: 100 },
        NY: { score: 90, components: {} },
      },
    });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    expect(await screen.findByText('California')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });
});
