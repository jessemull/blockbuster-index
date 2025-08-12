'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Html,
} from '@react-three/drei';
import { VHSCharacter } from './VHSCharacter';

function Loader() {
  return (
    <Html center>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[#f4dd32] rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-[#f4dd32] rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-3 h-3 bg-[#f4dd32] rounded-full animate-bounce"
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
    <Canvas className={className}>
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </Canvas>
  );
};

export default VHSCharacterScene;
