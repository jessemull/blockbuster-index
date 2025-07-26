import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VHSBot from './VHSBot';

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
  beforeEach(() => {
    jest.useFakeTimers();
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
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
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(screen.queryByText(/chat with tapey/i)).not.toBeInTheDocument();
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
      expect(screen.getByText(/ran into an issue/i)).toBeInTheDocument(),
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

  it('sends message when pressing Enter (not Shift+Enter)', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    mockFetch({
      message: 'Hey',
      history: [],
      timestamp: new Date().toISOString(),
      requestId: '3',
    });

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyPress(input, { key: 'Enter', shiftKey: false });

    await waitFor(() => expect(screen.getByText('Hey')).toBeInTheDocument());
  });

  it('does not send message on Shift+Enter', async () => {
    render(<VHSBot />);
    fireEvent.click(screen.getByLabelText(/open chat/i));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Should not send' } });
    fireEvent.keyPress(input, { key: 'Enter', shiftKey: true });

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
});
