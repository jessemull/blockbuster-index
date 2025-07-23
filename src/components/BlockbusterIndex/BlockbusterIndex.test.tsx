import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BlockbusterIndex from './BlockbusterIndex';

function mockFetch(response: any, ok = true) {
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(response),
      }) as any,
  );
}

describe('BlockbusterIndex', () => {
  afterEach(() => {
    (global.fetch as any).mockRestore?.();
  });

  it('shows loading state', async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ states: {} }),
        }) as any,
    );
    render(<BlockbusterIndex />);
    await waitFor(() =>
      expect(
        screen.getByText(/loading blockbuster index/i),
      ).toBeInTheDocument(),
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('shows error state if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    render(<BlockbusterIndex />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/fail/i)).toBeInTheDocument();
  });

  it('shows error state if fetch returns !ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: () => this,
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        json: async () => ({}),
        text: async () => '',
      } as unknown as Response),
    );
    render(<BlockbusterIndex />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });

  it('renders with empty data', async () => {
    mockFetch({ states: {} });
    render(<BlockbusterIndex />);
    await waitFor(() =>
      expect(screen.getByText(/blockbuster index/i)).toBeInTheDocument(),
    );
  });

  it('renders with real data and allows state click', async () => {
    mockFetch({
      states: {
        CA: {
          score: 50,
          components: { AMAZON: 10, CENSUS: 20, BROADBAND: 30, WALMART: 40 },
        },
        NY: {
          score: 60,
          components: { AMAZON: 20, CENSUS: 30, BROADBAND: 40, WALMART: 50 },
        },
      },
    });
    render(<BlockbusterIndex />);
    // Wait for the highest scoring state to appear
    await waitFor(() =>
      expect(screen.getByText('New York')).toBeInTheDocument(),
    );
    expect(screen.getByText(/score/i)).toBeInTheDocument();
    // Click California path
    const caPath = await screen.findByTestId('usa-state-ca');
    fireEvent.click(caPath);
    // Wait for California to be selected
    await waitFor(() =>
      expect(screen.getByText('California')).toBeInTheDocument(),
    );
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('handles edge case: all states have same score', async () => {
    mockFetch({
      states: {
        CA: { score: 42, components: {} },
        NY: { score: 42, components: {} },
      },
    });
    render(<BlockbusterIndex />);

    const initialState = await waitFor(() =>
      screen.getByText(/california|new york/i),
    );
    expect(
      initialState.textContent === 'California' ||
        initialState.textContent === 'New York',
    ).toBe(true);

    const otherStateAbbr =
      initialState.textContent === 'California' ? 'ny' : 'ca';
    const otherStateName =
      initialState.textContent === 'California' ? 'New York' : 'California';
    const otherPath = document.querySelector(`.usa-state.${otherStateAbbr}`);
    expect(otherPath).toBeTruthy();
    await fireEvent.click(otherPath!);
    await waitFor(() =>
      expect(screen.getByText(otherStateName)).toBeInTheDocument(),
    );
  });

  it('handles fetch error and shows error message', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    render(<BlockbusterIndex />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/fail/i)).toBeInTheDocument();
  });

  it('handles empty data and covers empty scores branch', async () => {
    mockFetch({ states: {} });
    render(<BlockbusterIndex />);
    await waitFor(() =>
      expect(screen.getByText(/blockbuster index/i)).toBeInTheDocument(),
    );
    // getStateRank with missing data/state
    const instance = screen.getByText(/blockbuster index/i);
    // Directly test getStateRank by accessing the component instance if possible, or just ensure no crash
    expect(instance).toBeInTheDocument();
  });
});
