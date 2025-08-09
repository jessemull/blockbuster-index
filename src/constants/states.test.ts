import { StateAbbreviations, StateNames } from './states';

describe('states constants', () => {
  it('contains DC and 51 entries including DC', () => {
    expect(StateAbbreviations).toContain('DC');
    expect(StateAbbreviations.length).toBeGreaterThanOrEqual(51);
  });

  it('maps CA and NY correctly', () => {
    expect(StateNames.CA).toBe('California');
    expect(StateNames.NY).toBe('New York');
  });
});
