import HomePage from '@pages/page';
import { axe } from 'jest-axe';
import { render, screen, waitFor } from '@testing-library/react';

// Mock fetch for BlockbusterIndex
beforeAll(() => {
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            states: {
              CA: {
                score: 50,
                components: {
                  AMAZON: 10,
                  CENSUS: 20,
                  BROADBAND: 30,
                  WALMART: 40,
                },
              },
              NY: {
                score: 60,
                components: {
                  AMAZON: 20,
                  CENSUS: 30,
                  BROADBAND: 40,
                  WALMART: 50,
                },
              },
            },
          }),
      }) as any,
  );
});
afterAll(() => {
  (global.fetch as any).mockRestore?.();
});

describe('HomePage Component', () => {
  it('Renders homepage and blockbuster index UI.', async () => {
    render(<HomePage />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /blockbuster index/i }),
      ).toBeInTheDocument(),
    );
    // Check for the digital vs. physical shopping subheading
    expect(
      screen.getByText(/digital vs. physical shopping/i),
    ).toBeInTheDocument();
    // Check for the call to action
    expect(
      screen.getByText(/click or tap a state to view its score/i),
    ).toBeInTheDocument();
    // Only the highest scoring state (New York) should be present initially
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.queryByText('California')).not.toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
