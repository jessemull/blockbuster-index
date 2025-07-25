import AboutPage from './page';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

describe('About Page', () => {
  it('renders the about page component', async () => {
    render(<AboutPage />);
    expect(
      await screen.getByRole('heading', { name: /about/i }),
    ).toBeInTheDocument();
    expect(
      await screen.getByText(
        /AI-powered exploration of how consumer buying habits have shifted/i,
      ),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AboutPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
