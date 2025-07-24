import React from 'react';
import Header from './Header';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockedLink = ({ children, href, onClick }: any) => (
    <a onClick={onClick} href={href}>
      {children}
    </a>
  );
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

describe('Header Component', () => {
  it('renders the header with logo and title', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Blockbuster Index')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signals/i })).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger button is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    expect(
      screen.getByRole('button', { name: /close menu/i }),
    ).toBeInTheDocument();

    // Check for mobile navigation elements specifically
    const mobileNav = screen.getByLabelText('Mobile navigation');
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveTextContent('Home');
    expect(mobileNav).toHaveTextContent('About');
    expect(mobileNav).toHaveTextContent('Signals');
  });

  it('closes mobile menu when close button is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    expect(
      screen.queryByRole('button', { name: /close menu/i }),
    ).not.toBeInTheDocument();
  });

  it('closes mobile menu when navigation link is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    const mobileHomeLink = homeLinks.find((link) =>
      link.closest('nav[aria-label="Mobile navigation"]'),
    );
    fireEvent.click(mobileHomeLink!);

    expect(
      screen.queryByRole('button', { name: /close menu/i }),
    ).not.toBeInTheDocument();
  });

  it('has correct navigation links with proper hrefs', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const signalsLink = screen.getByRole('link', { name: /signals/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(signalsLink).toHaveAttribute('href', '/signals');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when mobile menu is open', async () => {
    const { container } = render(<Header />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
