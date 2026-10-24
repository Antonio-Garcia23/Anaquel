import { Pressable, Text, type PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  className?: string;
};

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent',
  secondary: 'border border-border-strong bg-transparent',
  ghost: 'bg-transparent',
  danger: 'bg-transparent',
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: 'text-on-accent',
  secondary: 'text-text',
  ghost: 'text-accent',
  danger: 'text-danger',
};

export function Button({
  title,
  variant = 'primary',
  disabled,
  className,
  accessibilityLabel,
  accessibilityState,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
      disabled={disabled}
      className={[
        'min-h-touch min-w-touch items-center justify-center rounded-md px-4 active:opacity-70',
        containerClasses[variant],
        disabled ? 'opacity-40' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <Text className={`font-figtree-semibold text-body ${labelClasses[variant]}`}>{title}</Text>
    </Pressable>
  );
}
