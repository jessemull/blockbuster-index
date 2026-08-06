import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  it('renders a home link and not-found messaging', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
