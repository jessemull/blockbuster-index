'use client';

import React, { useRef } from 'react';
import { Box, Cylinder, Sphere, Capsule } from '@react-three/drei';
import * as THREE from 'three';

interface VHSCharacterProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const VHSCharacter: React.FC<VHSCharacterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // No animation for now - just static pose

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main VHS tape body - simple rectangle */}
      <Box args={[2, 1.2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      {/* Tape window - flat on the front face */}
      <Box args={[1.2, 0.6, 0.01]} position={[0, 0, 0.155]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>

      {/* Left eye - 3D egg-shaped with black pupil */}
      <Capsule
        args={[0.15, 0.2, 4, 8]}
        position={[-0.3, 0.65, 0.12]}
        rotation={[0, 0, Math.PI]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Capsule>
      {/* Left pupil - black dot in center */}
      <Sphere args={[0.06, 8, 8]} position={[-0.3, 0.55, 0.25]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Right eye - 3D egg-shaped with black pupil */}
      <Capsule
        args={[0.15, 0.2, 4, 8]}
        position={[0.3, 0.65, 0.12]}
        rotation={[0, 0, Math.PI]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Capsule>
      {/* Right pupil - black dot in center */}
      <Sphere args={[0.06, 8, 8]} position={[0.3, 0.55, 0.25]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Left arm - properly connected to the left side of the tape */}
      <group ref={leftArmRef} position={[-1, 0, 0]}>
        <Cylinder
          args={[0.08, 0.08, 0.8, 8]}
          position={[-0.1, 0, 0]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshStandardMaterial color="#1a1a1a" />
        </Cylinder>
        {/* Left hand - properly connected to the arm */}
        <Sphere args={[0.15, 8, 8]} position={[-0.4, 0.3, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
      </group>

      {/* Right arm - properly connected to the right side of the tape */}
      <group ref={rightArmRef} position={[1, 0, 0]}>
        <Cylinder
          args={[0.08, 0.08, 0.8, 8]}
          position={[0.1, 0, 0]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <meshStandardMaterial color="#1a1a1a" />
        </Cylinder>
        {/* Right hand - properly connected to the arm */}
        <Sphere args={[0.15, 8, 8]} position={[0.4, 0.3, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
      </group>
    </group>
  );
};

export default VHSCharacter;
