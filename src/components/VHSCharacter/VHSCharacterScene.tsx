'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { VHSCharacter } from './VHSCharacter';

interface VHSCharacterSceneProps {
  isAnimating?: boolean;
  className?: string;
}

export const VHSCharacterScene: React.FC<VHSCharacterSceneProps> = ({
  isAnimating = false,
  className = '',
}) => {
  return (
    <Canvas className={className}>
      <PerspectiveCamera makeDefault position={[1.8, 1.2, 5]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <Environment preset="city" />
      <VHSCharacter
        position={[0, 0, 0]}
        scale={1.8}
        isAnimating={isAnimating}
      />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
      />
    </Canvas>
  );
};

export default VHSCharacterScene;
