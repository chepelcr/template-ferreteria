import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#E8641E',
  brand2: '#1F4E8C',
  surface: '#EDECE8',
  // Raised cards are the least favorable reading surface in dark mode.
  darkSurface: '#1C2531',
  displayFont: '"Archivo", "Noto Sans", system-ui, sans-serif',
  bundledFonts: ['Archivo'],
  displayFallback: 'system-ui, sans-serif',
};
