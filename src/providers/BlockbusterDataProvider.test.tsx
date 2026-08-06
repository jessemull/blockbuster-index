import { act, render, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { BlockbusterDataProvider, useBlockbusterData } from '@providers';

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <BlockbusterDataProvider>{children}</BlockbusterDataProvider>
);

describe('BlockbusterDataProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('loads data successfully', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ states: {} }),
        }) as any,
    );

    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ states: {} });
  });

  it('rejects payloads without a states object', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ notStates: true }),
        }) as any,
    );

    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/invalid data format/i);
    expect(result.current.data).toBeNull();
  });

  it('rejects array states payloads', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ states: [] }),
        }) as any,
    );

    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/invalid data format/i);
    expect(result.current.data).toBeNull();
  });

  it('rejects state entries with non-numeric scores', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: { CA: { score: '90', components: {} } },
            }),
        }) as any,
    );

    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/invalid data format/i);
    expect(result.current.data).toBeNull();
  });

  it('accepts valid state scores with numeric components', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                CA: { score: 90.5, components: { AMAZON: 80 } },
              },
            }),
        }) as any,
    );

    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.data?.states.CA?.score).toBe(90.5);
  });

  it('surfaces a timeout when the fetch is aborted', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) return;
          const onAbort = () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          };
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener('abort', onAbort);
        }),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(15_000);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toMatch(/timed out/i);
    expect(result.current.data).toBeNull();
  });

  it('handles non-ok response', async () => {
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({ ok: false, json: () => Promise.resolve({}) }) as any,
    );
    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/failed to fetch data/i);
    expect(result.current.data).toBeNull();
  });

  it('handles thrown non-Error', async () => {
    (global.fetch as jest.Mock) = jest.fn(() => Promise.reject('plain string'));
    const { result } = renderHook(() => useBlockbusterData(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('An error occurred');
    expect(result.current.data).toBeNull();
  });

  it('throws if hook used outside provider', () => {
    // Suppress React error logging for intentional throw
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useBlockbusterData())).toThrow(
      /must be used within/i,
    );
    spy.mockRestore();
  });

  it('throws error when useBlockbusterData is used outside provider', () => {
    const TestComponent = () => {
      const data = useBlockbusterData();
      return <div>{data ? 'has data' : 'no data'}</div>;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useBlockbusterData must be used within a BlockbusterDataProvider',
    );
  });
});
