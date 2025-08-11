'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { VHSCharacter } from './VHSCharacter';

interface VHSCharacterSceneProps {
  className?: string;
  isAnimating?: boolean;
}

export const VHSCharacterScene: React.FC<VHSCharacterSceneProps> = ({
  className = '',
  isAnimating = false,
}) => {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Environment for better reflections */}
        <Environment preset="city" />

        {/* VHS Character */}
        <VHSCharacter
          position={[0, 0, 0]}
          scale={1.5}
          isAnimating={isAnimating}
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default VHSCharacterScene;
