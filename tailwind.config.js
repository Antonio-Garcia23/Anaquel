// Los valores de color viven en src/ui/theme/colors.ts; aquí solo se nombran las variables.
// Las escalas de espaciado y radios repiten src/ui/theme/spacing.ts y radii.ts: mantenlas iguales.

const colorTokens = [
  'bg',
  'surface',
  'surface-raised',
  'border',
  'border-strong',
  'text',
  'text-muted',
  'accent',
  'on-accent',
  'teal',
  'on-teal',
  'danger',
  'cover-1',
  'cover-2',
  'cover-3',
  'cover-4',
  'cover-5',
  'cover-6',
  'cover-text',
];

const colors = Object.fromEntries(
  colorTokens.map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      ...colors,
      // Franja del lomo: negro translúcido, igual en ambos temas.
      'cover-spine': 'rgb(var(--color-cover-spine) / 0.2)',
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      6: '24px',
      8: '32px',
    },
    borderRadius: {
      none: '0px',
      cover: '3px',
      md: '10px',
      lg: '18px',
      pill: '999px',
    },
    fontFamily: {
      'literata-medium': ['Literata_500Medium'],
      'literata-semibold': ['Literata_600SemiBold'],
      figtree: ['Figtree_400Regular'],
      'figtree-medium': ['Figtree_500Medium'],
      'figtree-semibold': ['Figtree_600SemiBold'],
    },
    fontSize: {
      display: ['32px', { lineHeight: '38px' }],
      title: ['20px', { lineHeight: '26px' }],
      body: ['16px', { lineHeight: '24px' }],
      caption: ['12px', { lineHeight: '16px' }],
    },
    extend: {
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
    },
  },
  plugins: [],
};
