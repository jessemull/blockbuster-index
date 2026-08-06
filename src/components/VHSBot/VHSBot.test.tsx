import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import VHSBot from './VHSBot';

jest.mock('@components/VHSCharacter', () => ({
  VHSCharacterScene: ({ isAnimating, className }: any) => (
    <div className={className} data-testid="vhs-character-scene">
      VHS Character Scene {isAnimating ? '(Animating)' : '(Static)'}
    </div>
  ),
}));

function mockFetch(data: any, ok = true) {
  (global.fetch as jest.Mock) = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      }) as any,
  );
}

describe('VHSBot', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    Element.prototype.scrollIntoView = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    consoleSpy.mockRestore();
  });

  it('renders closed bot button initially and opens chat', () => {
    render(<VHSBot />);
    expect(screen.getByLabelText(/open chat/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/open chat/i));
    expect(screen.getByText(/chat with tapey/i)).toBeInTheDocument();
  });

  it('closes the chat window when close button is clicked', () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));
    fireEvent.click(screen.getByLabelText(/close chat/i));
    expect(screen.queryByText(/chat with tapey/i)).not.toBeInTheDocument();
  });

  it('does not focus the open button on initial mount', () => {
    render(<VHSBot />);
    expect(screen.getByLabelText(/open chat/i)).not.toHaveFocus();
  });

  it('closes on Escape and restores focus to the open button', () => {
    render(<VHSBot />);
    const openButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(openButton);

    expect(screen.getByLabelText(/close chat/i)).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText(/chat with tapey/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/open chat/i)).toHaveFocus();
  });

  it('traps Tab focus within the dialog while open', () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const closeButton = screen.getByLabelText(/close chat/i);
    const input = screen.getByLabelText(/message to tapey/i);

    input.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(input).toHaveFocus();
  });

  it('disables send button and input when loading', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));
    mockFetch({
      message: 'Hello!',
      history: [],
      timestamp: new Date().toISOString(),
      requestId: '1',
    });

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByText(/send/i));

    expect(input).toBeDisabled();
    expect(screen.getByText(/send/i)).toBeDisabled();

    await waitFor(() => expect(screen.getByText('Hello!')).toBeInTheDocument());
  });

  it('shows error message when API returns error response', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              error: 'Bad request',
              requestId: '2',
              timestamp: new Date().toISOString(),
            }),
        }) as any,
    );

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Error me' } });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() =>
      expect(screen.getByText(/technical difficulties/i)).toBeInTheDocument(),
    );
    expect(screen.queryByText(/Bad request/i)).not.toBeInTheDocument();
  });

  it('shows safe error when chat JSON shape is invalid', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    mockFetch({ message: '', timestamp: 'not-a-date' });

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() =>
      expect(screen.getByText(/technical difficulties/i)).toBeInTheDocument(),
    );
  });

  it('shows fallback error when thrown error is not an instance of Error', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    (global.fetch as jest.Mock) = jest.fn(() => Promise.reject('plain string'));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Oops' } });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() =>
      expect(screen.getByText(/technical difficulties/i)).toBeInTheDocument(),
    );
  });

  it('sends message when clicking send button', async () => {
    (global.fetch as jest.Mock).mockReset();

    (global.fetch as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: 'Hey',
              history: [],
              timestamp: new Date().toISOString(),
              requestId: '3',
            }),
        }) as any,
    );

    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Test' } });

    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(screen.getByText('Hey')).toBeInTheDocument();
    });
  });

  it('does not send message on Shift+Enter', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Should not send' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(screen.queryByText('Should not send')).not.toBeInTheDocument();
  });

  it('renders default intro when there are no messages', () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));
    expect(screen.getByText(/blockbuster buddy/i)).toBeInTheDocument();
  });

  it('renders loading animation when isLoading is true', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    mockFetch({
      message: 'Bot here',
      history: [],
      timestamp: new Date().toISOString(),
      requestId: '4',
    });

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Loader test' } });
    fireEvent.click(screen.getByText(/send/i));

    expect(screen.getByText(/tapey is thinking/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('Bot here')).toBeInTheDocument(),
    );
  });

  it('aborts in-flight chat fetch when the dialog closes', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) return;
          const onAbort = () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          };
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener('abort', onAbort);
        }),
    );

    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hang forever' } });
    fireEvent.click(screen.getByText(/send/i));

    expect(screen.getByText(/tapey is thinking/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/close chat/i));

    await waitFor(() =>
      expect(screen.queryByText(/tapey is thinking/i)).not.toBeInTheDocument(),
    );
    expect(
      screen.queryByText(/technical difficulties/i),
    ).not.toBeInTheDocument();
  });
});
