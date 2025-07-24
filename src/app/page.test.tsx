import HomePage from './page';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@components/BlockbusterIndex', () => {
  const MockedIndex = () => (
    <div data-testid="mock-blockbuster-index">Mock BlockbusterIndex</div>
  );
  MockedIndex.displayName = 'MockedIndex';
  return MockedIndex;
});

describe('HomePage', () => {
  it('renders the BlockbusterIndex component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-blockbuster-index')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
