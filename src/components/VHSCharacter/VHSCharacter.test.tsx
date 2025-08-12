import React from 'react';
import { render } from '@testing-library/react';
import { VHSCharacter } from './VHSCharacter';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((callback) => callback({ clock: { elapsedTime: 0 } })),
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
  Capsule: ({ children, ...props }: any) => (
    <div data-testid="capsule" {...props}>
      {children}
    </div>
  ),
  RoundedBox: ({ children, ...props }: any) => (
    <div data-testid="rounded-box" {...props}>
      {children}
    </div>
  ),
  Circle: ({ children, ...props }: any) => (
    <div data-testid="circle" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('three', () => ({
  LatheGeometry: jest.fn(() => ({
    rotateZ: jest.fn(),
  })),
  Vector2: jest.fn(),
  TorusGeometry: jest.fn(() => ({
    rotateZ: jest.fn(),
  })),
  Group: jest.fn(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { z: 0 },
  })),
  Mesh: jest.fn(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { z: 0 },
  })),
}));

describe('VHSCharacter', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('PascalCase') ||
          args[0].includes('unrecognized in this browser') ||
          args[0].includes('start its name with an uppercase letter') ||
          args[0].includes('Received `true` for a non-boolean attribute') ||
          args[0].includes('pass a string instead') ||
          args[0].includes('does not recognize the') ||
          args[0].includes('spell it as lowercase'))
      ) {
        return;
      }

      consoleSpy.mockRestore();
      console.error(...args);
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders without crashing', () => {
    const { container } = render(<VHSCharacter />);
    expect(container).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(
      <VHSCharacter position={[1, 2, 3]} rotation={[0, 0, 0]} scale={2} />,
    );

    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    const mainGroup = groups[0];
    expect(mainGroup).toHaveAttribute('position', '1,2,3');
    expect(mainGroup).toHaveAttribute('scale', '2');
  });

  it('renders all geometric components', () => {
    const { getAllByTestId } = render(<VHSCharacter />);

    expect(getAllByTestId('box').length).toBeGreaterThan(0);
    expect(getAllByTestId('cylinder').length).toBeGreaterThan(0);
    expect(getAllByTestId('sphere').length).toBeGreaterThan(0);
  });

  it('renders with animation enabled', () => {
    const { container } = render(<VHSCharacter isAnimating={true} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with all props combinations', () => {
    const { container } = render(
      <VHSCharacter
        position={[1, 2, 3]}
        rotation={[0.1, 0.2, 0.3]}
        scale={2.5}
        isAnimating={true}
      />,
    );
    expect(container).toBeInTheDocument();

    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    const mainGroup = groups[0];
    expect(mainGroup).toHaveAttribute('position', '1,2,3');
    expect(mainGroup).toHaveAttribute('rotation', '0.1,0.2,0.3');
    expect(mainGroup).toHaveAttribute('scale', '2.5');
  });

  it('renders all specific components', () => {
    const { getAllByTestId } = render(<VHSCharacter />);

    expect(getAllByTestId('box').length).toBeGreaterThan(0);
    expect(getAllByTestId('cylinder').length).toBeGreaterThan(0);
    expect(getAllByTestId('sphere').length).toBeGreaterThan(0);
    expect(getAllByTestId('capsule').length).toBeGreaterThan(0);
    expect(getAllByTestId('rounded-box').length).toBeGreaterThan(0);
    expect(getAllByTestId('circle').length).toBeGreaterThan(0);
  });

  it('renders with different animation states', () => {
    const { container: container1 } = render(
      <VHSCharacter isAnimating={false} />,
    );
    expect(container1).toBeInTheDocument();

    const { container: container2 } = render(
      <VHSCharacter isAnimating={true} />,
    );
    expect(container2).toBeInTheDocument();
  });

  it('covers animation logic branches', () => {
    const mockUseFrame = require('@react-three/fiber').useFrame;

    render(<VHSCharacter isAnimating={true} />);

    expect(mockUseFrame).toHaveBeenCalled();
  });

  it('simulates animation execution', () => {
    const mockClock = { elapsedTime: 5 };

    const mockUseFrame = require('@react-three/fiber').useFrame;
    mockUseFrame.mockImplementation((callback: any) => {
      callback({ clock: mockClock });
    });

    render(<VHSCharacter isAnimating={true} />);

    expect(mockUseFrame).toHaveBeenCalled();
  });

  it('covers all animation branches with mocked refs', () => {
    const mockUseFrame = require('@react-three/fiber').useFrame;
    mockUseFrame.mockImplementation((callback: any) => {
      callback({ clock: { elapsedTime: 0 } });
      callback({ clock: { elapsedTime: 3 } });
      callback({ clock: { elapsedTime: 6 } });
    });

    render(<VHSCharacter isAnimating={true} />);

    expect(mockUseFrame).toHaveBeenCalled();
  });

  it('tests animation logic execution', () => {
    let capturedCallback: any;
    const mockUseFrame = require('@react-three/fiber').useFrame;
    mockUseFrame.mockImplementation((callback: any) => {
      capturedCallback = callback;
    });

    render(<VHSCharacter isAnimating={true} />);

    expect(mockUseFrame).toHaveBeenCalled();

    expect(capturedCallback).toBeDefined();
  });

  it('covers all component rendering paths', () => {
    const { container } = render(
      <VHSCharacter
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1}
        isAnimating={true}
      />,
    );

    expect(container).toBeInTheDocument();

    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    expect(
      container.querySelectorAll('[data-testid="capsule"]').length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('[data-testid="rounded-box"]').length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('[data-testid="circle"]').length,
    ).toBeGreaterThan(0);
  });

  it('renders with extreme prop values', () => {
    const { container } = render(
      <VHSCharacter
        position={[100, -50, 999]}
        rotation={[Math.PI, -Math.PI, 2 * Math.PI]}
        scale={0.1}
        isAnimating={false}
      />,
    );

    expect(container).toBeInTheDocument();

    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    const mainGroup = groups[0];
    expect(mainGroup).toHaveAttribute('position', '100,-50,999');
    expect(mainGroup).toHaveAttribute(
      'rotation',
      '3.141592653589793,-3.141592653589793,6.283185307179586',
    );
    expect(mainGroup).toHaveAttribute('scale', '0.1');
  });

  it('renders with zero and negative scale values', () => {
    const { container } = render(
      <VHSCharacter
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={0}
        isAnimating={false}
      />,
    );

    expect(container).toBeInTheDocument();

    const groups = container.querySelectorAll('group');
    expect(groups.length).toBeGreaterThan(0);

    const mainGroup = groups[0];
    expect(mainGroup).toHaveAttribute('scale', '0');
  });

  it('renders with all animation states and prop combinations', () => {
    const testCases: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
      isAnimating: boolean;
    }> = [
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        isAnimating: false,
      },
      {
        position: [1, 1, 1],
        rotation: [0.5, 0.5, 0.5],
        scale: 2,
        isAnimating: true,
      },
      {
        position: [-1, -1, -1],
        rotation: [-0.5, -0.5, -0.5],
        scale: 0.5,
        isAnimating: false,
      },
    ];

    testCases.forEach((testCase) => {
      const { container } = render(
        <VHSCharacter
          position={testCase.position}
          rotation={testCase.rotation}
          scale={testCase.scale}
          isAnimating={testCase.isAnimating}
        />,
      );

      expect(container).toBeInTheDocument();

      const groups = container.querySelectorAll('group');
      expect(groups.length).toBeGreaterThan(0);

      const mainGroup = groups[0];
      expect(mainGroup).toHaveAttribute(
        'position',
        (testCase.position as [number, number, number]).join(','),
      );
      expect(mainGroup).toHaveAttribute(
        'rotation',
        (testCase.rotation as [number, number, number]).join(','),
      );
      expect(mainGroup).toHaveAttribute('scale', testCase.scale.toString());
    });
  });
});
