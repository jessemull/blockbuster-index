import React from 'react';
import { VHSCharacterScene } from './VHSCharacterScene';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn(({ children, className }) => (
    <div data-testid="canvas" className={className}>
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
    expect(container.querySelector('[data-testid="canvas"]')).toHaveClass(
      'custom-class',
    );
    expect(
      container.querySelector('[data-testid="vhs-character"]'),
    ).toBeInTheDocument();
  });
});
