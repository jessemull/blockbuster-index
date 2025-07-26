/**
 * Scrolls an element into view with smooth behavior
 * @param element - The element to scroll to
 */
export function scrollToBottom(element: HTMLElement | null): void {
  element?.scrollIntoView({ behavior: 'smooth' });
}
