import { COLORS } from './colors';

describe('COLORS', () => {
  it('contains the mandated yellow hex', () => {
    expect(COLORS.YELLOW).toBe('#f4dd32');
  });
});
