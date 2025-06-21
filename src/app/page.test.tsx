import HomePage from '@pages/page';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('HomePage Component', () => {
  it('Renders homepage.', () => {
    render(<HomePage />);
    expect(screen.getAllByText(/blockbuster index/i).length).toBe(2);
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
