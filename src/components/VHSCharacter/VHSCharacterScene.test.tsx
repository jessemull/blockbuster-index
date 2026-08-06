import { render } from '@testing-library/react';
import React from 'react';
import { VHSCharacterScene } from './VHSCharacterScene';

jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn(({ children, className }) => (
    <div className={className} data-testid="canvas">
      {children}
    </div>
  )),
}));

jest.mock('@react-three/drei', () => ({
  Environment: jest.fn(() => <div data-testid="environment" />),
  OrbitControls: jest.fn(() => <div data-testid="orbit-controls" />),
  PerspectiveCamera: jest.fn(() => <div data-testid="perspective-camera" />),
}));

jest.mock('./VHSCharacter', () => ({
  VHSCharacter: jest.fn(() => <div data-testid="vhs-character" />),
}));

describe('VHSCharacterScene', () => {
  it('renders with default props', () => {
    const { container } = render(<VHSCharacterScene />);
    expect(container).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="canvas"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="vhs-character"]'),
    ).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(
      <VHSCharacterScene className="custom-class" isAnimating />,
    );
    expect(container).toBeInTheDocument();
    const wrapper = container.querySelector('[aria-label]');
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/tapey/i),
    );
    expect(wrapper).not.toHaveAttribute('role', 'img');
    expect(
      container.querySelector('[data-testid="vhs-character"]'),
    ).toBeInTheDocument();
  });
});
