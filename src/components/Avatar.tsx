import { ViewStyle, Image, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types/theme';

export type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
};

const DEFAULT_SIZE = 40;

function getInitials(name: string | undefined): string {
  const trimmed = name?.trim() ?? '';
  return trimmed[0]?.toUpperCase() ?? '?';
}

export const Avatar = ({
  uri,
  name,
  size = DEFAULT_SIZE,
  style,
}: AvatarProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, size);
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size }]}
      />
    );
  }
  const letter = getInitials(name);
  return (
    <View style={[styles.circle, style]}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

const getStyles = (theme: Theme, size: number, backgroundColor?: string) => {
  return StyleSheet.create({
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor:
        backgroundColor ?? theme.colors.chat?.bubbleSent ?? '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    letter: {
      fontSize: size * 0.5,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.inverse,
    },
  });
};
