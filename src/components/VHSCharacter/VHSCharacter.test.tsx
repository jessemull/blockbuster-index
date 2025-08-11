import React from 'react';
import { render } from '@testing-library/react';
import { VHSCharacter } from './VHSCharacter';

// Mock Three.js components since we can't render WebGL in tests
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: any) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Cylinder: ({ children, ...props }: any) => (
    <div data-testid="cylinder" {...props}>
      {children}
    </div>
  ),
  Sphere: ({ children, ...props }: any) => (
    <div data-testid="sphere" {...props}>
      {children}
    </div>
  ),
}));

describe('VHSCharacter', () => {
  it('renders without crashing', () => {
    const { container } = render(<VHSCharacter />);
    expect(container).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(
      <VHSCharacter position={[1, 2, 3]} rotation={[0, 0, 0]} scale={2} />,
    );

    // Look for group elements (lowercase from the mock)
    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    // Check that the main group has the custom props
    const mainGroup = groups[0];
    expect(mainGroup).toHaveAttribute('position', '1,2,3');
    expect(mainGroup).toHaveAttribute('scale', '2');
  });

  it('renders all geometric components', () => {
    const { getAllByTestId } = render(<VHSCharacter />);

    // Should have multiple boxes, cylinders, and spheres
    expect(getAllByTestId('box').length).toBeGreaterThan(0);
    expect(getAllByTestId('cylinder').length).toBeGreaterThan(0);
    expect(getAllByTestId('sphere').length).toBeGreaterThan(0);
  });
});
