import { Insets, StyleSheet } from 'react-native';
import {
  BorderRadius,
  bottomTabSpacing,
  Spacing,
} from '../../constants/spacing';
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
      padding: Spacing.sm,
      paddingBottom: bottom ? bottom + Spacing.xs : Spacing.xs,
      backgroundColor: mainBgColor,
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
    },
  });
};

export const getBottomTabItemStyle = ({ theme }: { theme: Theme }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      height: bottomTabSpacing.bottomTabHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      height: bottomTabSpacing.bottomTabHeight,
      width: bottomTabSpacing.bottomTabWeight,
      borderRadius: BorderRadius.md,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    shadow: {
      width: 1,
      height: 1,
      borderRadius: BorderRadius.full,
      // boxShadow: `0 0 34px 22px ${theme.colors.primary[400]}`,
      position: 'absolute',
      zIndex: 0,
    },
  });
};
