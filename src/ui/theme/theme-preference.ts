import Storage from 'expo-sqlite/kv-store';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'anaquel.theme-preference';
const DEFAULT_PREFERENCE: ThemePreference = 'light';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

// Lectura síncrona para aplicar el tema guardado desde el primer render, sin parpadeo.
export function loadThemePreference(): ThemePreference {
  try {
    const stored = Storage.getItemSync(STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await Storage.setItem(STORAGE_KEY, preference);
}
