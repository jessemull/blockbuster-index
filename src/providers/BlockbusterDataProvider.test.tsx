import React from 'react';
import { BlockbusterDataProvider, useBlockbusterData } from '@providers';
import { renderHook, waitFor, render } from '@testing-library/react';

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <BlockbusterDataProvider>{children}</BlockbusterDataProvider>
);

describe('BlockbusterDataProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
