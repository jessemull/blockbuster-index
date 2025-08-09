import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VHSBot from './VHSBot';
import { API_ENDPOINTS } from '@constants';

describe('VHSBot production endpoint', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_ENVIRONMENT;

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_ENVIRONMENT = originalEnv;
    jest.restoreAllMocks();
  });

  it('uses production URL when NEXT_PUBLIC_API_ENVIRONMENT=production', async () => {
    process.env.NEXT_PUBLIC_API_ENVIRONMENT = 'production';
    (global.fetch as jest.Mock) = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: 'ok',
              timestamp: new Date().toISOString(),
              requestId: 'x',
            }),
        }) as any,
    );

    render(<VHSBot />);

    fireEvent.click(screen.getByLabelText(/open chat/i));
    fireEvent.change(screen.getByPlaceholderText(/type your message/i), {
      target: { value: 'hi' },
    });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toBe(API_ENDPOINTS.CHAT.PRODUCTION);
  });
});
