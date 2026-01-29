import { Insets, StyleSheet } from 'react-native';
import { Spacing } from '../../constants/spacing';
import { Theme } from '../../types/theme';

export const getStyle = ({
  theme,
  insets,
}: {
  theme: Theme;
  insets: Insets;
}) => {
  const { bottom } = insets;

  const mainBgColor = theme.colors.primary[700];
  const textColor = theme.colors.text.inverse;
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      padding: Spacing.md,
      paddingBottom: bottom ? bottom + Spacing.md : Spacing.md,
      backgroundColor: mainBgColor,
    },
  });
};
