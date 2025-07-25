import RankingsPage from './page';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Rankings', () => {
  const MockedRankings = () => (
    <div data-testid="mock-blockbuster-index">Mock Rankings</div>
  );
  MockedRankings.displayName = 'MockedRankings';
  return MockedRankings;
});

describe('RankingsPage', () => {
  it('renders the rankings page', () => {
    render(<RankingsPage />);
    expect(screen.getByTestId('mock-blockbuster-index')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RankingsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
