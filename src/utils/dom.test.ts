import { scrollIntoView } from './dom';

describe('scrollIntoView', () => {
  it('calls scrollIntoView on the element', () => {
    const el = { scrollIntoView: jest.fn() } as any as HTMLElement;
    scrollIntoView(el);
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does nothing when element is null', () => {
    expect(() => scrollIntoView(null)).not.toThrow();
  });
});
