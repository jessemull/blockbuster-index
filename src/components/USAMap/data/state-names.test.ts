import { StateNames } from './state-names';

describe('StateNames', () => {
  it('should contain California and New York', () => {
    expect(StateNames).toHaveProperty('CA', 'California');
    expect(StateNames).toHaveProperty('NY', 'New York');
  });

  it('should have 50 states and DC', () => {
    expect(Object.keys(StateNames).length).toBe(51);
  });
});
