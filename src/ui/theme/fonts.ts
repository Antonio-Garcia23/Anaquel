// Se importa cada peso por separado: importar desde la raíz del paquete metería todos los pesos en la app.
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Literata_500Medium } from '@expo-google-fonts/literata/500Medium';
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold';

// Literata para títulos, Figtree para el resto. Los nombres son los de tailwind.config.js (fontFamily).
export const fonts = {
  Literata_500Medium,
  Literata_600SemiBold,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
};
