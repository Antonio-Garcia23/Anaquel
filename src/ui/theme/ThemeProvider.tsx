import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  type Theme as NavigationTheme,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { colorScheme as nativewindColorScheme, useColorScheme } from 'nativewind';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { themeColors, themeVars, type ColorScheme, type ThemeColors } from './colors';
import { loadThemePreference, saveThemePreference, type ThemePreference } from './theme-preference';

type ThemeContextValue = {
  /** Lo que eligió la persona: Claro, Oscuro o Sistema. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** El tema que se ve ahora, ya resuelto. */
  scheme: ColorScheme;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function navigationTheme(scheme: ColorScheme, colors: ThemeColors): NavigationTheme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(loadThemePreference);
  const systemScheme = useColorScheme().colorScheme ?? 'light';
  const scheme: ColorScheme = preference === 'system' ? systemScheme : preference;
  const colors = themeColors[scheme];

  // NativeWind pasa la preferencia a Appearance, así el teclado y las alertas siguen el tema.
  useEffect(() => {
    nativewindColorScheme.set(preference);
  }, [preference]);

  // Fondo de la vista nativa, para que no haya destellos de otro color al cambiar de pantalla.
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.bg);
  }, [colors.bg]);

  function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    // Si no se pudiera guardar, el tema igual se aplica en esta sesión.
    saveThemePreference(next).catch(() => {});
  }

  return (
    <ThemeContext value={{ preference, setPreference, scheme, colors }}>
      <NavigationThemeProvider value={navigationTheme(scheme, colors)}>
        <View className="flex-1" style={themeVars[scheme]}>
          {children}
        </View>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>.');
  }
  return context;
}
