'use client';

import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { VHSCharacter } from './VHSCharacter';

function Loader() {
  return (
    <Html center>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-brand-yellow rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-brand-yellow rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-3 h-3 bg-brand-yellow rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </Html>
  );
}

interface VHSCharacterSceneProps {
  className?: string;
  isAnimating?: boolean;
}

export const VHSCharacterScene: React.FC<VHSCharacterSceneProps> = ({
  className = '',
  isAnimating = false,
}) => {
  return (
    <div
      aria-label="Interactive 3D Tapey character. Drag to rotate the view."
      className={className}
    >
      <Canvas>
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[1.8, 1.2, 5]} />
          <ambientLight intensity={0.4} />
          <directionalLight intensity={1} position={[10, 10, 5]} />
          <pointLight intensity={0.5} position={[-10, -10, -5]} />
          <Environment preset="city" />
          <VHSCharacter
            isAnimating={isAnimating}
            position={[0, 0, 0]}
            scale={1.8}
          />
          <OrbitControls
            enablePan={false}
            enableRotate={true}
            enableZoom={true}
            maxDistance={10}
            minDistance={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VHSCharacterScene;
