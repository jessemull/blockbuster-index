'use client';

import { Move } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import { VHSCharacterScene } from '@components/VHSCharacter';
import { API_ENDPOINTS, COLORS } from '@constants';
import { ChatRequest, ChatResponse, Message } from '@types';
import { formatHistoryForAPI, scrollIntoView } from '@utils';

const USER_SAFE_CHAT_ERROR =
  'Sorry, I seem to be having some technical difficulties. Please try again!';

const VHSBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTapeyAnimating, setIsTapeyAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (messages.length === 0) return;
    scrollIntoView(messagesEndRef.current);
  }, [messages]);

  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        openButtonRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    const dialog = dialogRef.current;
    if (!dialog) return;

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
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
        throw new Error('Chat request failed');
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Start Tapey's animation based on response length...

      startTapeyAnimation(botMessage.content.length);
    } catch {
      console.error('Chat request failed');
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: USER_SAFE_CHAT_ERROR,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startTapeyAnimation = (responseLength: number) => {
    const baseDuration = 2000;
    const perCharacterDuration = 100;
    const maxDuration = 5000;

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
          aria-label="Open chat with Tapey"
          className="bg-[#181a2b] border-2 border-[#f4dd32] rounded-full p-4 shadow-lg hover:bg-[#1f2235] transition-colors duration-200"
          ref={openButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke={COLORS.YELLOW}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </button>
      )}

      {isOpen && (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="bg-[#181a2b] border-2 border-[#f4dd32] rounded-lg shadow-lg w-[calc(100vw-2rem)] md:w-80 h-[calc(100vh-2rem)] max-h-[32rem] md:h-[32rem] flex flex-col fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:static md:transform-none"
          ref={dialogRef}
          role="dialog"
        >
          <div className="p-4 border-b border-[#f4dd32]">
            <div className="flex justify-between items-center">
              <h3 className="text-[#f4dd32] font-semibold text-lg" id={titleId}>
                Chat with Tapey
              </h3>
              <button
                aria-label="Close chat"
                className="text-white hover:text-[#f4dd32] transition-colors p-1 rounded hover:bg-gray-700"
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  fill="none"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
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

            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-[#f4dd32]">
            <div className="w-full h-24 bg-white rounded-lg overflow-hidden border-2 border-[#f4dd32] p-1 relative mb-4">
              <div className="absolute top-1 right-1 z-10">
                <Move className="w-5 h-5 text-black" />
              </div>
              <VHSCharacterScene
                className="w-full h-full"
                isAnimating={isTapeyAnimating}
              />
            </div>
          </div>
          <div className="p-4 border-t border-[#f4dd32]">
            <div className="flex space-x-2 items-center">
              <input
                aria-label="Message to Tapey"
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-[#f4dd32] focus:outline-none disabled:opacity-50 text-sm"
                disabled={isLoading}
                placeholder="Type your message..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="bg-[#f4dd32] text-black px-4 py-2 rounded hover:bg-yellow-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                disabled={isLoading || !input.trim()}
                type="button"
                onClick={sendMessage}
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
