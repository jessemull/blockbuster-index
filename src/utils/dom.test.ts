import { scrollToBottom } from './dom';

describe('scrollToBottom', () => {
  it('calls scrollIntoView when element exists', () => {
    const el = { scrollIntoView: jest.fn() } as any as HTMLElement;
    scrollToBottom(el);
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does nothing when element is null', () => {
    expect(() => scrollToBottom(null)).not.toThrow();
  });
});
