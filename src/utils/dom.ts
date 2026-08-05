/**
 * Scrolls an element into view with smooth behavior.
 * @param element - The element to scroll into view
 */
export function scrollIntoView(element: HTMLElement | null): void {
  element?.scrollIntoView({ behavior: 'smooth' });
}
