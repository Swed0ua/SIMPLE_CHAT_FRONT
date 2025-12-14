export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export type FontSizeKeys = keyof typeof Typography.fontSize;
export type FontWeightKeys = keyof typeof Typography.fontWeight;
export type LineHeightKeys = keyof typeof Typography.lineHeight;

export type Typography = typeof Typography;
export type TypographyKeys = keyof typeof Typography;
