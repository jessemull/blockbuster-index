import About from './About';
import React from 'react';
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

describe('About Component', () => {
  it('renders the about page with correct content', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(
      screen.getByText(/we're working on something exciting/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/blockbuster index methodology/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to home/i }),
    ).toBeInTheDocument();
  });

  it('has correct link to home page', () => {
    render(<About />);

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders with correct styling classes', () => {
    render(<About />);

    const title = screen.getByRole('heading', { name: /about/i });
    expect(title).toHaveClass('text-[#f4dd32]');
    expect(title).toHaveClass('font-light');

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveClass('bg-[#0f1029]');
    expect(homeLink).toHaveClass('text-[#f4dd32]');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<About />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
