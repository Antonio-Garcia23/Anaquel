// Pantalla temporal para revisar el sistema de diseño; se borrará.
// Excepción a la regla de i18n: sus textos van escritos aquí porque i18next aún no está configurado.

import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, GeneratedCover, Text } from '@/ui';
import {
  coverColors,
  lightColors,
  useTheme,
  type ThemeColorName,
  type ThemePreference,
} from '@/ui/theme';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
];

const themeColorNames = Object.keys(lightColors) as ThemeColorName[];
const coverColorEntries = Object.entries(coverColors);

// Elegidos para que el hash dé los seis colores de portada.
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
  const { preference, setPreference, colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="gap-8 px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
    >
      <Text variant="display">Sistema de diseño</Text>

      <Section title="Tema">
        <View className="flex-row gap-2">
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              title={option.label}
              variant={preference === option.value ? 'primary' : 'secondary'}
              accessibilityState={{ selected: preference === option.value }}
              onPress={() => setPreference(option.value)}
              className="flex-1"
            />
          ))}
        </View>
      </Section>

      <Section title="Colores">
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

      <Section title="Textos">
        <View className="gap-2 rounded-lg bg-surface p-4">
          <Text variant="display">Display · Literata</Text>
          <Text variant="title">Title · Literata</Text>
          <Text variant="body">Body · Figtree. Tu biblioteca, en tu bolsillo y sin internet.</Text>
          <Text variant="caption">Caption · Figtree</Text>
          <Text variant="body" tone="muted">
            Tono muted para textos secundarios.
          </Text>
        </View>
      </Section>

      <Section title="Botones">
        <View className="gap-3">
          <Button variant="primary" title="Agregar libro" />
          <Button variant="secondary" title="Escanear ISBN" />
          <Button variant="ghost" title="Ver detalles" />
          <Button variant="danger" title="Eliminar libro" />
          <Button variant="primary" title="Deshabilitado" disabled />
        </View>
      </Section>

      <Section title="Portadas generadas">
        <View className="flex-row flex-wrap gap-4">
          {sampleBooks.map((book) => (
            <GeneratedCover key={book.title} title={book.title} author={book.author} width={96} />
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}
