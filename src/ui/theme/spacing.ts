// Escala de espaciado en px. tailwind.config.js la repite como p-1 … p-8: mantenlas iguales.
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
} as const;

// Área táctil mínima (min-h-touch / min-w-touch).
export const minTouchSize = 44;
