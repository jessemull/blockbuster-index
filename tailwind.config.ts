import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 prefers CSS-first config (`@import "tailwindcss"` in globals.css).
 * Keep this file for tooling that still resolves `tailwind.config.*`.
 */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {},
  plugins: [],
} satisfies Config;
