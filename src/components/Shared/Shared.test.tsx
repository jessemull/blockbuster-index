import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { ChevronSelect } from './ChevronSelect';
import { Footer } from './Footer';
import { PageBackground } from './PageBackground';

describe('ChevronSelect', () => {
  it('renders options and calls onChange', () => {
    const onChange = jest.fn();
    render(
      <ChevronSelect
        aria-label="Pick one"
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' },
        ]}
        value="a"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Pick one'), {
      target: { value: 'b' },
    });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ChevronSelect
        aria-label="Pick one"
        options={[{ label: 'Alpha', value: 'a' }]}
        value="a"
        onChange={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Footer', () => {
  it('renders copyright with current year', () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('PageBackground', () => {
  it('renders children', () => {
    render(
      <PageBackground>
        <p>Hello shell</p>
      </PageBackground>,
    );
    expect(screen.getByText('Hello shell')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PageBackground>
        <h1>Title</h1>
      </PageBackground>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
