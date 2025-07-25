import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Rankings from './Rankings';
import { BlockbusterDataProvider } from '../BlockbusterIndex/BlockbusterDataProvider';

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
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/fail/i)).toBeInTheDocument();
  });

  it('shows error if fetch not ok', async () => {
    mockFetch({}, false);
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('shows empty state if no states', async () => {
    mockFetch({ states: {} });
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    // Should not render any table rows
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
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
    // Default signal
    expect(await screen.findByText(/blockbuster index/i)).toBeInTheDocument();
    expect(screen.getByText(/weighted combination/i)).toBeInTheDocument();
    // Change signal
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
    // Both CA and NY should be rank 1, TX rank 3
    expect(await screen.findAllByText('1')).toHaveLength(2);
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
    // Force 2 columns
    global.innerWidth = 900;
    act(() => window.dispatchEvent(new Event('resize')));
    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );
    // Should render 2 columns
    expect(await screen.findAllByRole('table')).toHaveLength(2);
    // Force 3 columns
    global.innerWidth = 1200;
    act(() => window.dispatchEvent(new Event('resize')));
    // Should render 3 columns
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
    expect(await screen.findByText('Rank')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('CA')).toBeInTheDocument();
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
    // Should still render CA and NY
    expect(await screen.findByText('CA')).toBeInTheDocument();
    expect(screen.getByText('NY')).toBeInTheDocument();
  });
});
