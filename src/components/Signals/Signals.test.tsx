import React from 'react';
import Signals from './Signals';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockedLink = ({ children, href, className }: any) => (
    <a className={className} href={href}>
      {children}
    </a>
  );
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

describe('Signals Component', () => {
  it('renders the signals page with correct content', () => {
    render(<Signals />);

    expect(
      screen.getByRole('heading', { name: /signals/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /calculated using a weighted combination of multiple signals/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sliding window calculations/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to home/i }),
    ).toBeInTheDocument();
  });

  it('has correct link to home page', () => {
    render(<Signals />);

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders with correct styling classes', () => {
    render(<Signals />);

    const title = screen.getByRole('heading', { name: /signals/i });
    expect(title).toHaveClass('text-[#f4dd32]');
    expect(title).toHaveClass('font-light');

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveClass('bg-[#0f1029]');
    expect(homeLink).toHaveClass('text-[#f4dd32]');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Signals />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
