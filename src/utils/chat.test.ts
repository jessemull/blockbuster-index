import { formatHistoryForAPI } from './chat';

describe('formatHistoryForAPI', () => {
  const makeMsg = (role: 'user' | 'assistant', content: string, date: string) =>
    ({
      role,
      content,
      timestamp: new Date(date),
    }) as any;

  it('trims to last 5 messages and serializes timestamp', () => {
    const messages = [
      makeMsg('user', 'a', '2020-01-01T00:00:00Z'),
      makeMsg('assistant', 'b', '2020-01-02T00:00:00Z'),
      makeMsg('user', 'c', '2020-01-03T00:00:00Z'),
      makeMsg('assistant', 'd', '2020-01-04T00:00:00Z'),
      makeMsg('user', 'e', '2020-01-05T00:00:00Z'),
      makeMsg('assistant', 'f', '2020-01-06T00:00:00Z'),
    ];

    const result = formatHistoryForAPI(messages);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({
      role: 'assistant',
      content: 'b',
      timestamp: '2020-01-02T00:00:00.000Z',
    });
    expect(result[4]).toEqual({
      role: 'assistant',
      content: 'f',
      timestamp: '2020-01-06T00:00:00.000Z',
    });
  });

  it('handles empty input', () => {
    expect(formatHistoryForAPI([])).toEqual([]);
  });
});
