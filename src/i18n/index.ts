import { getLocales, useLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import es from './es.json';
import {
  loadLanguagePreference,
  saveLanguagePreference,
  type LanguagePreference,
} from './language-preference';

// Instancia propia de la app; react-i18next la toma de initReactI18next.
const i18n = createInstance();

export const supportedLanguages = ['es', 'en'] as const;
export type Language = (typeof supportedLanguages)[number];

// Español es el idioma por defecto y el de respaldo si falta un texto en inglés.
export const defaultLanguage: Language = 'es';

export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

function isLanguage(value: string | null | undefined): value is Language {
  return value === 'es' || value === 'en';
}

// Si el teléfono no está en español ni en inglés, la app queda en español.
function languageFromCode(code: string | null | undefined): Language {
  return isLanguage(code) ? code : defaultLanguage;
}

// Idioma del teléfono en este momento.
export function systemLanguage(): Language {
  return languageFromCode(getLocales()[0]?.languageCode);
}

export function resolveLanguage(preference: LanguagePreference): Language {
  return preference === 'system' ? systemLanguage() : preference;
}

export function setLanguagePreference(preference: LanguagePreference): void {
  void i18n.changeLanguage(resolveLanguage(preference));
  // Si no se pudiera guardar, el idioma igual cambia en esta sesión.
  saveLanguagePreference(preference).catch(() => {});
}

export { loadLanguagePreference, type LanguagePreference };

// Con la preferencia "Sistema", sigue al idioma del teléfono mientras la app está abierta.
// En Android se puede cambiar el idioma sin reiniciar la app; en iOS el sistema la reinicia.
export function useSystemLanguageSync(): void {
  const phoneLanguage = languageFromCode(useLocales()[0]?.languageCode);

  useEffect(() => {
    if (loadLanguagePreference() === 'system' && i18n.language !== phoneLanguage) {
      void i18n.changeLanguage(phoneLanguage);
    }
  }, [phoneLanguage]);
}

// Los textos van dentro de la app, así que la inicialización es inmediata (sin esperar red).
void i18n.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(loadLanguagePreference()),
  fallbackLng: defaultLanguage,
  supportedLngs: [...supportedLanguages],
  initAsync: false,
  interpolation: {
    // React ya escapa los textos.
    escapeValue: false,
  },
});

export default i18n;
