import { vars } from 'nativewind';

// Único lugar de la app con colores hex. Los componentes usan las clases de NativeWind
// (bg-bg, text-text-muted, …) o useTheme().colors, nunca estos valores directo.

export type ColorScheme = 'light' | 'dark';

export const lightColors = {
  bg: '#F4F1EA',
  surface: '#FBF9F4',
  'surface-raised': '#FFFFFF',
  border: '#D8D1C4',
  'border-strong': '#8C8578',
  text: '#1C1F24',
  'text-muted': '#66615A',
  accent: '#A84B1A',
  'on-accent': '#FFFFFF',
  teal: '#2F6F68',
  'on-teal': '#FFFFFF',
  danger: '#B42318',
} as const;

export type ThemeColorName = keyof typeof lightColors;
export type ThemeColors = Record<ThemeColorName, string>;

export const darkColors: ThemeColors = {
  bg: '#121417',
  surface: '#1C1F24',
  'surface-raised': '#262A30',
  border: '#2E333A',
  'border-strong': '#646A73',
  text: '#F2EFEA',
  'text-muted': '#A19C94',
  accent: '#E07A3F',
  'on-accent': '#121417',
  teal: '#56A89D',
  'on-teal': '#121417',
  danger: '#F07470',
};

export const themeColors: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

// Portadas generadas: iguales en ambos temas, con texto blanco encima.
export const coverColors = {
  'cover-1': '#7A2E2E',
  'cover-2': '#2F4F6F',
  'cover-3': '#7D6636',
  'cover-4': '#3E6B5A',
  'cover-5': '#5B3F6E',
  'cover-6': '#A8552F',
  'cover-text': '#FFFFFF',
  // Se usa al 20 % de opacidad (ver tailwind.config.js).
  'cover-spine': '#000000',
} as const;

export const coverColorNames = [
  'cover-1',
  'cover-2',
  'cover-3',
  'cover-4',
  'cover-5',
  'cover-6',
] as const;

export type CoverColorName = (typeof coverColorNames)[number];

// '#F4F1EA' → '244 241 234', el formato que espera rgb(var(--x) / <alpha-value>).
function toRgbChannels(hex: string): string {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

function toCssVariables(colors: Record<string, string>): Record<`--${string}`, string> {
  return Object.fromEntries(
    Object.entries(colors).map(([name, hex]) => [`--color-${name}`, toRgbChannels(hex)]),
  );
}

// Variables CSS por tema; ThemeProvider las aplica en la raíz y todos los hijos las heredan.
export const themeVars = {
  light: vars(toCssVariables({ ...lightColors, ...coverColors })),
  dark: vars(toCssVariables({ ...darkColors, ...coverColors })),
};
