'use client';

import React, { useState } from 'react';
import { VHSCharacterScene } from './VHSCharacterScene';

export const VHSCharacterDemo: React.FC = () => {
  const [characterScale, setCharacterScale] = useState(1.5);
  const [characterRotation, setCharacterRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎬 VHS Tape Character
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A stylized 3D anthropomorphic VHS tape created with Three.js and
            React Three Fiber. Features talking, eyebrow movement, and arm
            waving animations. Click and drag to rotate and scroll to zoom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 3D Scene */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
              <VHSCharacterScene
                className="w-full h-96 rounded-lg overflow-hidden"
                isAnimating={isAnimating}
              />
            </div>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🎮 Controls
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>
                  • <strong>Left Click + Drag:</strong> Rotate camera
                </li>
                <li>
                  • <strong>Right Click + Drag:</strong> Pan camera
                </li>
                <li>
                  • <strong>Scroll:</strong> Zoom in/out
                </li>
                <li>
                  • <strong>Double Click:</strong> Reset camera
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🔧 Character Controls
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scale: {characterScale.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={characterScale}
                    onChange={(e) =>
                      setCharacterScale(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation: {Math.round(characterRotation)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={characterRotation}
                    onChange={(e) =>
                      setCharacterRotation(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        // Random duration between 1-5 seconds
                        const randomDuration = Math.random() * 4000 + 1000;
                        setTimeout(() => setIsAnimating(false), randomDuration);
                      }
                    }}
                    disabled={isAnimating}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isAnimating
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isAnimating ? '🎬 Animating...' : '🎬 Start Animation'}
                  </button>
                  {isAnimating && (
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Animation will stop automatically
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                ✨ Features
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Animated VHS tape character</li>
                <li>• Talking mouth animation</li>
                <li>• Moving eyebrows</li>
                <li>• Waving arms</li>
                <li>• Realistic VHS tape geometry</li>
                <li>• Interactive camera controls</li>
                <li>• Dynamic lighting and shadows</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🎯 About This Character
            </h3>
            <p className="text-gray-700">
              This 3D VHS tape character was inspired by classic retro
              aesthetics and modern 3D design principles. It features a black
              body with white eyes, articulated arms with white gloves, and the
              iconic tape reels visible through a transparent window. The
              character has a friendly, anthropomorphic appearance that captures
              the nostalgic charm of VHS technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VHSCharacterDemo;
