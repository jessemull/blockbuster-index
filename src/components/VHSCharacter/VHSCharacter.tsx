'use client';

import React, { useRef } from 'react';
import {
  Box,
  Capsule,
  Circle,
  Cylinder,
  RoundedBox,
  Sphere,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VHSCharacterProps {
  isAnimating?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const VHSCharacter: React.FC<VHSCharacterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isAnimating = false,
}) => {
  const currentAmplitude = useRef(0.115);
  const currentSpeed = useRef(10);
  const groupRef = useRef<THREE.Group>(null);
  const lastSpeedChange = useRef(0);
  const leftArmRef = useRef<THREE.Group>(null);
  const leftEyebrowRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightEyebrowRef = useRef<THREE.Mesh>(null);
  const talkingLineRef = useRef<THREE.Mesh>(null);
  const talkingLineRef2 = useRef<THREE.Mesh>(null);
  const targetAmplitude = useRef(0.115);
  const targetSpeed = useRef(10);
  const timeOffset = useRef(0);

  useFrame((state) => {
    if (!isAnimating) return;

    const time = state.clock.elapsedTime;

    // Talking animation...

    if (talkingLineRef.current && talkingLineRef2.current) {
      if (time - lastSpeedChange.current > 2) {
        const baseFrequency = 8;
        const speedVariation = 0.15;
        const baseAmplitude = 0.115;
        const amplitudeVariation = 0.04;

        targetSpeed.current =
          baseFrequency + (Math.random() - 0.5) * speedVariation * 2;

        targetAmplitude.current =
          baseAmplitude + (Math.random() - 0.5) * amplitudeVariation * 2;

        lastSpeedChange.current = time;
      }

      // Smoothly interpolate current values toward target values...

      const lerpFactor = 0.02;

      currentSpeed.current +=
        (targetSpeed.current - currentSpeed.current) * lerpFactor;

      currentAmplitude.current +=
        (targetAmplitude.current - currentAmplitude.current) * lerpFactor;

      // First line moves up...

      talkingLineRef.current.position.y =
        Math.sin((time - timeOffset.current) * currentSpeed.current) *
        currentAmplitude.current;

      // Second line moves down...

      talkingLineRef2.current.position.y =
        -Math.sin((time - timeOffset.current) * currentSpeed.current) *
        currentAmplitude.current;
    }

    // Eyebrow animation. Left goes up as right goes down...

    if (leftEyebrowRef.current && rightEyebrowRef.current) {
      const eyebrowAmplitude = 0.06;
      const eyebrowFrequency = 10;

      // Left eyebrow moves up...

      leftEyebrowRef.current.position.y =
        0.95 + Math.sin(time * eyebrowFrequency) * eyebrowAmplitude;

      // Right eyebrow moves down...

      rightEyebrowRef.current.position.y =
        0.95 - Math.sin(time * eyebrowFrequency) * eyebrowAmplitude;
    }

    // Hand waving animation. Gentle back and forth motion...

    if (leftArmRef.current && rightArmRef.current) {
      const waveAmplitude = 0.2;
      const waveFrequency = 10;

      // Left arm waves back and forth...

      leftArmRef.current.rotation.z =
        Math.PI / 6 + Math.sin(time * waveFrequency) * waveAmplitude;

      // Right arm waves back and forth...

      rightArmRef.current.rotation.z =
        -Math.PI / 6 - Math.sin(time * waveFrequency) * waveAmplitude;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* VHS Tape Body */}
      <Box args={[2, 1.2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      {/* Black Box Middle of Tape */}
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
      {/* White Box In Black Box In Middle of Tape */}
      <RoundedBox
        args={[0.45, 0.4, 0.035]}
        radius={0.01}
        smoothness={4}
        position={[0, 0, 0.1525]}
      >
        <meshStandardMaterial
          color="#ffffff"
          transparent={true}
          opacity={1.0}
        />
      </RoundedBox>
      {/* Talking Animation Lines */}
      <Box
        args={[0.45, 0.03, 0.04]}
        position={[0, 0, 0.155]}
        ref={talkingLineRef}
      >
        <meshStandardMaterial color="#000000" />
      </Box>
      <Box
        args={[0.45, 0.03, 0.04]}
        position={[0, 0, 0.155]}
        ref={talkingLineRef2}
      >
        <meshStandardMaterial color="#000000" />
      </Box>
      {/* Left Reel */}
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
      {/* Right Reel */}
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
      {/* Left Eyebrow */}
      <mesh
        position={[-0.35, 0.95, 0.08]}
        rotation={[0, 0, Math.PI / 36]}
        ref={leftEyebrowRef}
      >
        <primitive
          object={(() => {
            const geometry = new THREE.TorusGeometry(
              0.15,
              0.015,
              8,
              16,
              Math.PI / 2,
            );
            geometry.rotateZ(Math.PI / 3.25);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Left Eye Ball */}
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
      {/* Left Pupil */}
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
      {/* Right Eyebrow */}
      <mesh
        position={[0.35, 0.95, 0.08]}
        rotation={[0, 0, -Math.PI / 36]}
        ref={rightEyebrowRef}
      >
        <primitive
          object={(() => {
            const geometry = new THREE.TorusGeometry(
              0.15,
              0.015,
              8,
              16,
              Math.PI / 2,
            );
            geometry.rotateZ(Math.PI / 4.75);
            return geometry;
          })()}
        />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Right Eye Ball */}
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
      {/* Right Pupil */}
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
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.9, 0, 0]}>
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
        {/* Left Hand */}
        <Sphere args={[0.15, 16, 16]} position={[-0.575, 0.55, 0]}>
          <meshStandardMaterial color="#ffffff" flatShading={false} />
        </Sphere>
      </group>
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.9, 0, 0]}>
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
        {/* Right Hand */}
        <Sphere args={[0.15, 16, 16]} position={[0.575, 0.55, 0]}>
          <meshStandardMaterial color="#ffffff" flatShading={false} />
        </Sphere>
      </group>
      {/* Left Leg */}
      <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[-0.4, -0.8, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>
      {/* Right Leg */}
      <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[0.4, -0.8, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>
      {/* Left Foot */}
      <Capsule
        args={[0.15, 0.2, 8, 16]}
        position={[-0.4, -1, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#ffffff" flatShading={false} />
      </Capsule>

      {/* Right Foot */}
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
