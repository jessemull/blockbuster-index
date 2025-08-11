'use client';

import React, { useRef } from 'react';
import {
  Box,
  Cylinder,
  Sphere,
  Capsule,
  RoundedBox,
  Circle,
} from '@react-three/drei';
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

      {/* Black box centered in tape window */}
      <RoundedBox
        args={[0.65, 0.675, 0.03]}
        radius={0.015}
        smoothness={4}
        position={[0, 0, 0.1525]}
      >
        <meshStandardMaterial
          color="#000000"
          transparent={true}
          opacity={0.7}
        />
      </RoundedBox>

      {/* White box inside black box */}
      <RoundedBox
        args={[0.45, 0.4, 0.035]}
        radius={0.01}
        smoothness={4}
        position={[0, 0, 0.1525]}
      >
        <meshStandardMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.4}
        />
      </RoundedBox>

      {/* Left tape reel circle */}
      <Circle
        args={[0.275, 32]}
        position={[-0.4, 0, 0.165]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#808080"
          roughness={0.2}
          metalness={0.05}
        />
      </Circle>

      {/* Right tape reel circle */}
      <Circle
        args={[0.275, 32]}
        position={[0.4, 0, 0.165]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#808080"
          roughness={0.2}
          metalness={0.05}
        />
      </Circle>

      {/* Left eye - 3D egg-shaped using custom geometry */}
      <mesh position={[-0.3, 0.675, 0.08]} rotation={[0, 0, Math.PI / 36]}>
        <primitive
          object={(() => {
            const points = [];
            for (let deg = 0; deg <= 180; deg += 6) {
              const rad = (Math.PI * deg) / 180;
              const point = new THREE.Vector2(
                0.22 * Math.sin(rad),
                -Math.cos(rad) * 0.3,
              );
              points.push(point);
            }
            const geometry = new THREE.LatheGeometry(points, 32);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Left pupil - black egg-shaped */}
      <mesh position={[-0.3, 0.575, 0.25]} rotation={[0, 0, Math.PI / 36]}>
        <primitive
          object={(() => {
            const points = [];
            for (let deg = 0; deg <= 180; deg += 6) {
              const rad = (Math.PI * deg) / 180;
              const point = new THREE.Vector2(
                0.08 * Math.sin(rad),
                -Math.cos(rad) * 0.12,
              );
              points.push(point);
            }
            const geometry = new THREE.LatheGeometry(points, 32);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Right eye - 3D egg-shaped using custom geometry */}
      <mesh position={[0.3, 0.675, 0.08]} rotation={[0, 0, -Math.PI / 36]}>
        <primitive
          object={(() => {
            const points = [];
            for (let deg = 0; deg <= 180; deg += 6) {
              const rad = (Math.PI * deg) / 180;
              const point = new THREE.Vector2(
                0.22 * Math.sin(rad),
                -Math.cos(rad) * 0.3,
              );
              points.push(point);
            }
            const geometry = new THREE.LatheGeometry(points, 32);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Right pupil - black egg-shaped */}
      <mesh position={[0.3, 0.575, 0.25]} rotation={[0, 0, -Math.PI / 36]}>
        <primitive
          object={(() => {
            const points = [];
            for (let deg = 0; deg <= 180; deg += 6) {
              const rad = (Math.PI * deg) / 180;
              const point = new THREE.Vector2(
                0.08 * Math.sin(rad),
                -Math.cos(rad) * 0.12,
              );
              points.push(point);
            }
            const geometry = new THREE.LatheGeometry(points, 32);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Left arm - properly connected to the left side of the tape */}
      <group ref={leftArmRef} position={[-1, 0, 0]}>
        <Capsule
          args={[0.08, 0.4, 8, 16]}
          position={[-0.18, 0.05, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#1a1a1a" flatShading={false} />
        </Capsule>
        <Capsule
          args={[0.08, 0.45, 8, 16]}
          position={[-0.475, 0.275, 0]}
          rotation={[0, 0, Math.PI / 8]}
        >
          <meshStandardMaterial color="#1a1a1a" flatShading={false} />
        </Capsule>
        {/* Right hand - properly connected to the arm */}
        <Sphere args={[0.15, 16, 16]} position={[-0.575, 0.55, 0]}>
          <meshStandardMaterial color="#ffffff" flatShading={false} />
        </Sphere>
      </group>

      {/* Right arm - properly connected to the right side of the tape */}
      <group ref={rightArmRef} position={[1, 0, 0]}>
        <Capsule
          args={[0.08, 0.4, 8, 16]}
          position={[0.18, 0.05, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#1a1a1a" flatShading={false} />
        </Capsule>
        <Capsule
          args={[0.08, 0.45, 8, 16]}
          position={[0.475, 0.275, 0]}
          rotation={[0, 0, -Math.PI / 8]}
        >
          <meshStandardMaterial color="#1a1a1a" flatShading={false} />
        </Capsule>
        {/* Right hand - properly connected to the arm */}
        <Sphere args={[0.15, 16, 16]} position={[0.575, 0.55, 0]}>
          <meshStandardMaterial color="#ffffff" flatShading={false} />
        </Sphere>
      </group>

      {/* Left leg - black cylinder */}
      <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[-0.4, -0.8, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>

      {/* Right leg - black cylinder */}
      <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[0.4, -0.8, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>

      {/* Left foot - white oval */}
      <Capsule
        args={[0.15, 0.2, 8, 16]}
        position={[-0.4, -1, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#ffffff" flatShading={false} />
      </Capsule>

      {/* Right foot - white oval */}
      <Capsule
        args={[0.15, 0.2, 8, 16]}
        position={[0.4, -1, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#ffffff" flatShading={false} />
      </Capsule>
    </group>
  );
};

export default VHSCharacter;
