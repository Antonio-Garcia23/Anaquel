import { StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>Anaquel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLight: {
    backgroundColor: '#F4F1EA',
  },
  containerDark: {
    backgroundColor: '#1C1B19',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
  },
  titleLight: {
    color: '#1C1B19',
  },
  titleDark: {
    color: '#F4F1EA',
  },
});
