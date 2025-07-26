import { Message, ChatMessage } from '@types';

/**
 * Formats message history for API consumption
 * Takes the last 5 messages and converts them to the API format
 * @param messages - Array of messages to format
 * @returns Formatted messages for API
 */
export function formatHistoryForAPI(messages: Message[]): ChatMessage[] {
  return messages.slice(-5).map((msg) => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp.toISOString(),
  }));
}
