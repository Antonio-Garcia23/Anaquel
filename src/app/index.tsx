import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, Text } from '@/ui';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-bg">
      {/* "Anaquel" es el nombre de la app: no se traduce. */}
      <Text variant="display">Anaquel</Text>
      {/* Enlace solo de desarrollo; se borra junto con /dev/design. */}
      {__DEV__ ? (
        <Link href="/dev/design" asChild>
          <Button variant="ghost" title={t('home.designSystemLink')} />
        </Link>
      ) : null}
    </View>
  );
}
