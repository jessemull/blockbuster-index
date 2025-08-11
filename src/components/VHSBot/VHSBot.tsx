'use client';

import React, { useState, useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '@constants';
import { ChatRequest, ChatResponse, ErrorResponse, Message } from '@types';
import { formatHistoryForAPI, scrollToBottom } from '@utils';
import { VHSCharacter } from '@components/VHSCharacter';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Move } from 'lucide-react';

const VHSBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isTapeyAnimating, setIsTapeyAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom(messagesEndRef.current);
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShouldScrollToBottom(true);
    setIsLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_ENVIRONMENT === 'production'
          ? API_ENDPOINTS.CHAT.PRODUCTION
          : API_ENDPOINTS.CHAT.DEVELOPMENT;

      const requestBody: ChatRequest = {
        message: userMessage.content,
        history: formatHistoryForAPI(messages),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Start Tapey's animation based on response length
      startTapeyAnimation(botMessage.content.length);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `Sorry, I ran into an issue: ${error.message}`
            : 'Sorry, I seem to be having some technical difficulties. Please try again!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startTapeyAnimation = (responseLength: number) => {
    // Calculate animation duration based on response length
    // Base duration: 2 seconds, + 0.1 seconds per character, max 8 seconds
    const baseDuration = 2000;
    const perCharacterDuration = 100;
    const maxDuration = 8000;

    const duration = Math.min(
      baseDuration + responseLength * perCharacterDuration,
      maxDuration,
    );

    setIsTapeyAnimating(true);
    setTimeout(() => setIsTapeyAnimating(false), duration);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Tapey"
          className="bg-[#181a2b] border-2 border-[#f4dd32] rounded-full p-4 shadow-lg hover:bg-[#1f2235] transition-colors duration-200"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="#f4dd32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-[#181a2b] border-2 border-[#f4dd32] rounded-lg shadow-lg w-[calc(100vw-2rem)] md:w-80 h-[calc(100vh-2rem)] max-h-[28rem] md:h-[28rem] flex flex-col fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:static md:transform-none">
          <div className="p-4 border-b border-[#f4dd32]">
            {/* Title and Close Button Row */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#f4dd32] font-semibold text-lg">
                Chat with Tapey
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#f4dd32] transition-colors p-1 rounded hover:bg-gray-700"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Tapey Full Row with Yellow Border */}
            <div className="w-full h-28 bg-white rounded-lg overflow-hidden border-2 border-[#f4dd32] p-1 relative">
              <div className="absolute top-1 right-1 z-10">
                <Move className="w-5 h-5 text-black" />
              </div>
              <Canvas>
                <PerspectiveCamera makeDefault position={[1.8, 1.2, 5]} />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />

                {/* Environment for better reflections */}
                <Environment preset="city" />

                {/* VHS Character */}
                <VHSCharacter
                  position={[0, 0, 0]}
                  scale={1.8}
                  isAnimating={isTapeyAnimating}
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
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                <p>Hey there! I&apos;m Tapey, your 90s Blockbuster buddy.</p>
                <p className="mt-2">
                  Ask me about movies, music, or anything from the good old
                  days!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#f4dd32] text-black'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#f4dd32] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#f4dd32] rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#f4dd32] rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm">Tapey is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {isTapeyAnimating && !isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#f4dd32] text-black p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">🎬 Tapey is talking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[#f4dd32]">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-[#f4dd32] focus:outline-none disabled:opacity-50 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#f4dd32] text-black px-4 py-2 rounded hover:bg-yellow-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VHSBot;
