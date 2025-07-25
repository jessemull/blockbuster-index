import { StateAbbreviations } from './state-abbreviations';

describe('StateAbbreviations', () => {
  it('should include CA and NY', () => {
    expect(StateAbbreviations).toContain('CA');
    expect(StateAbbreviations).toContain('NY');
  });

  it('should have 50 states and DC', () => {
    expect(StateAbbreviations.length).toBe(51);
  });
});
