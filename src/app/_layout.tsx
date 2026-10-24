import '../global.css';
// Inicializa i18next antes de que se dibuje cualquier pantalla.
import '@/i18n';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { fonts, ThemeProvider } from '@/ui/theme';

// La pantalla de inicio sigue visible hasta que las fuentes estén listas.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fonts);
  // Si las fuentes fallan, la app arranca igual con las del sistema.
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
