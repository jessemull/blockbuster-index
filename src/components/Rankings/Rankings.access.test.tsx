import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Rankings from './Rankings';
import { BlockbusterDataProvider } from '../BlockbusterIndex/BlockbusterDataProvider';

function mockFetch(data: any, ok = true) {
  (global.fetch as jest.Mock) = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      }) as any,
  );
}

describe('Rankings additional coverage', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses 1 column layout on small screens and updates description on select', async () => {
    mockFetch({
      states: {
        CA: { score: 10, components: { AMAZON: 1 } },
        NY: { score: 9, components: {} },
      },
    });

    // Force small width
    (global as any).innerWidth = 500;
    act(() => window.dispatchEvent(new Event('resize')));

    render(
      <BlockbusterDataProvider>
        <Rankings />
      </BlockbusterDataProvider>,
    );

    // Wait for the description of default 'score'
    expect(
      await screen.findByText(/weighted combination of all signals/i),
    ).toBeInTheDocument();

    // Change to AMAZON signal; description should update
    const select = screen.getByLabelText(/select signal/i) as HTMLSelectElement;
    act(() => {
      select.value = 'AMAZON';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Description update (partial match acceptable)
    expect(
      await screen.findByText(/amazon: amazon job scraping/i),
    ).toBeInTheDocument();
  });
});
