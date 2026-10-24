import Storage from 'expo-sqlite/kv-store';

export type LanguagePreference = 'es' | 'en' | 'system';

const STORAGE_KEY = 'anaquel.language-preference';
const DEFAULT_PREFERENCE: LanguagePreference = 'system';

function isLanguagePreference(value: unknown): value is LanguagePreference {
  return value === 'es' || value === 'en' || value === 'system';
}

// Lectura síncrona para que el primer render ya salga en el idioma guardado.
export function loadLanguagePreference(): LanguagePreference {
  try {
    const stored = Storage.getItemSync(STORAGE_KEY);
    return isLanguagePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

export async function saveLanguagePreference(preference: LanguagePreference): Promise<void> {
  await Storage.setItem(STORAGE_KEY, preference);
}
