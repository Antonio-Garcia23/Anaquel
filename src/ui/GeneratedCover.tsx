import { Text, View } from 'react-native';

import { coverColorNames, type CoverColorName } from './theme';

export type GeneratedCoverProps = {
  title: string;
  author?: string;
  /** Ancho en px; el alto sale de la proporción 2:3. */
  width?: number;
};

// Clases completas para que Tailwind las encuentre al compilar.
const coverClasses: Record<CoverColorName, string> = {
  'cover-1': 'bg-cover-1',
  'cover-2': 'bg-cover-2',
  'cover-3': 'bg-cover-3',
  'cover-4': 'bg-cover-4',
  'cover-5': 'bg-cover-5',
  'cover-6': 'bg-cover-6',
};

// djb2: el mismo título siempre da el mismo color.
function hashTitle(title: string): number {
  let hash = 5381;
  for (const char of title.trim().toLowerCase()) {
    hash = ((hash << 5) + hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

export function coverColorFor(title: string): CoverColorName {
  return coverColorNames[hashTitle(title) % coverColorNames.length];
}

export function GeneratedCover({ title, author, width = 120 }: GeneratedCoverProps) {
  const height = width * 1.5;
  const spineWidth = Math.max(4, Math.round(width * 0.06));
  const padding = Math.round(width * 0.1);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={author ? `${title}, ${author}` : title}
      className={`overflow-hidden rounded-cover ${coverClasses[coverColorFor(title)]}`}
      style={{ width, height }}
    >
      <View
        className="absolute bottom-0 left-0 top-0 bg-cover-spine"
        style={{ width: spineWidth }}
      />
      <View
        className="flex-1 justify-between"
        style={{
          paddingVertical: padding,
          paddingLeft: spineWidth + padding,
          paddingRight: padding,
        }}
      >
        <Text
          className="font-literata-semibold text-cover-text"
          style={{ fontSize: width * 0.13, lineHeight: width * 0.16 }}
          numberOfLines={5}
        >
          {title}
        </Text>
        {author ? (
          <Text
            className="font-figtree text-cover-text"
            style={{ fontSize: width * 0.09, lineHeight: width * 0.12 }}
            numberOfLines={2}
          >
            {author}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
