export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const bottomTabSpacing = {
  bottomTabHeight: 60,
  bottomTabWeight: 60,
  bottomTabIconSize: 28,
};

export type SpacingKeys = keyof typeof Spacing;
export type BorderRadiusKeys = keyof typeof BorderRadius;
