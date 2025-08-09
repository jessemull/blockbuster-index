import { API_ENDPOINTS } from './api';

describe('API_ENDPOINTS', () => {
  it('exposes chat endpoints', () => {
    expect(API_ENDPOINTS.CHAT.PRODUCTION).toMatch(/^https:\/\//);
    expect(API_ENDPOINTS.CHAT.DEVELOPMENT).toMatch(/^https:\/\//);
  });
});
