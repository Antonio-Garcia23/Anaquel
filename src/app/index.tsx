import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button, Text } from '@/ui';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-bg">
      <Text variant="display">Anaquel</Text>
      {/* Excepción temporal a la regla de i18n: enlace solo de desarrollo, se borra con /dev/design. */}
      {__DEV__ ? (
        <Link href="/dev/design" asChild>
          <Button variant="ghost" title="Sistema de diseño" />
        </Link>
      ) : null}
    </View>
  );
}
