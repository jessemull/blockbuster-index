import React from 'react';
import SignalsPage from './page';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

describe('Signals Page', () => {
  it('renders the signals page component', async () => {
    render(<SignalsPage />);
    expect(
      await screen.findByRole('heading', { name: /signals/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /calculated using a weighted combination of multiple signals/i,
      ),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SignalsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
