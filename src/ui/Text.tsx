import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

export type TextVariant = 'display' | 'title' | 'body' | 'caption';
export type TextTone = 'default' | 'muted';

export type TextProps = NativeTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

const variantClasses: Record<TextVariant, string> = {
  display: 'font-literata-semibold text-display',
  title: 'font-literata-semibold text-title',
  body: 'font-figtree text-body',
  caption: 'font-figtree-medium text-caption',
};

const toneClasses: Record<TextTone, string> = {
  default: 'text-text',
  muted: 'text-text-muted',
};

export function Text({ variant = 'body', tone = 'default', className, ...props }: TextProps) {
  return (
    <NativeText
      className={[variantClasses[variant], toneClasses[tone], className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
