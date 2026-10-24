// Pantalla temporal para revisar el sistema de diseño; se borrará.

import { Redirect } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loadLanguagePreference, setLanguagePreference, type LanguagePreference } from '@/i18n';
import { Button, GeneratedCover, Text } from '@/ui';
import {
  coverColors,
  lightColors,
  useTheme,
  type ThemeColorName,
  type ThemePreference,
} from '@/ui/theme';

const themeOptions: ThemePreference[] = ['light', 'dark', 'system'];
const languageOptions: LanguagePreference[] = ['es', 'en', 'system'];

const themeColorNames = Object.keys(lightColors) as ThemeColorName[];
const coverColorEntries = Object.entries(coverColors);

// Elegidos para que el hash dé los seis colores de portada. Son datos de ejemplo, no se traducen.
const sampleBooks = [
  { title: 'Ficciones', author: 'Jorge Luis Borges' },
  { title: 'Los de abajo', author: 'Mariano Azuela' },
  { title: 'El laberinto de la soledad', author: 'Octavio Paz' },
  { title: 'Pedro Páramo', author: 'Juan Rulfo' },
  { title: 'Rayuela', author: 'Julio Cortázar' },
  { title: 'Cien años de soledad', author: 'Gabriel García Márquez' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="title">{title}</Text>
      {children}
    </View>
  );
}

function Swatch({ name, color }: { name: string; color: string }) {
  return (
    <View className="w-1/3 gap-1 p-1">
      <View className="h-8 rounded-md border border-border" style={{ backgroundColor: color }} />
      <Text variant="caption" tone="muted">
        {name}
      </Text>
    </View>
  );
}

export default function DesignScreen() {
  const { t } = useTranslation();
  const { preference, setPreference, colors } = useTheme();
  const [language, setLanguage] = useState(loadLanguagePreference);
  const insets = useSafeAreaInsets();

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  function chooseLanguage(next: LanguagePreference) {
    setLanguage(next);
    setLanguagePreference(next);
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="gap-8 px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
    >
      <Text variant="display">{t('devDesign.title')}</Text>

      <Section title={t('devDesign.sections.theme')}>
        <View className="flex-row gap-2">
          {themeOptions.map((option) => (
            <Button
              key={option}
              title={t(`devDesign.theme.${option}`)}
              variant={preference === option ? 'primary' : 'secondary'}
              accessibilityState={{ selected: preference === option }}
              onPress={() => setPreference(option)}
              className="flex-1"
            />
          ))}
        </View>
      </Section>

      <Section title={t('devDesign.sections.language')}>
        <View className="flex-row gap-2">
          {languageOptions.map((option) => (
            <Button
              key={option}
              title={t(`devDesign.language.${option}`)}
              variant={language === option ? 'primary' : 'secondary'}
              accessibilityState={{ selected: language === option }}
              onPress={() => chooseLanguage(option)}
              className="flex-1"
            />
          ))}
        </View>
      </Section>

      <Section title={t('devDesign.sections.colors')}>
        <View className="-m-1 flex-row flex-wrap">
          {themeColorNames.map((name) => (
            <Swatch key={name} name={name} color={colors[name]} />
          ))}
        </View>
        <View className="-m-1 flex-row flex-wrap">
          {coverColorEntries.map(([name, color]) => (
            <Swatch key={name} name={name} color={color} />
          ))}
        </View>
      </Section>

      <Section title={t('devDesign.sections.texts')}>
        <View className="gap-2 rounded-lg bg-surface p-4">
          <Text variant="display">{t('devDesign.samples.display')}</Text>
          <Text variant="title">{t('devDesign.samples.title')}</Text>
          <Text variant="body">{t('devDesign.samples.body')}</Text>
          <Text variant="caption">{t('devDesign.samples.caption')}</Text>
          <Text variant="body" tone="muted">
            {t('devDesign.samples.muted')}
          </Text>
        </View>
      </Section>

      <Section title={t('devDesign.sections.buttons')}>
        <View className="gap-3">
          <Button variant="primary" title={t('devDesign.buttons.primary')} />
          <Button variant="secondary" title={t('devDesign.buttons.secondary')} />
          <Button variant="ghost" title={t('devDesign.buttons.ghost')} />
          <Button variant="danger" title={t('devDesign.buttons.danger')} />
          <Button variant="primary" title={t('devDesign.buttons.disabled')} disabled />
        </View>
      </Section>

      <Section title={t('devDesign.sections.covers')}>
        <View className="flex-row flex-wrap gap-4">
          {sampleBooks.map((book) => (
            <GeneratedCover key={book.title} title={book.title} author={book.author} width={96} />
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}
