import { Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../Avatar';
import { getStyles } from './ScreenHeader.styles';
import BackButton from '../BackButton';

export type ScreenHeaderProps = {
  onBackPress: () => void;
  title: string;
  subtitle?: string;
  avatarUri?: string | null;
  avatarName?: string;
  rightActions?: React.ReactNode;
  style?: ViewStyle;
};

export const ScreenHeader = ({
  onBackPress,
  title,
  subtitle,
  avatarUri,
  avatarName,
  rightActions,
  style,
}: ScreenHeaderProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles({ theme, insets });
  return (
    <View style={[styles.container, style]}>
      <BackButton onPress={onBackPress} />
      <View style={styles.center}>
        <Avatar uri={avatarUri} name={avatarName ?? title} />
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle != null && subtitle !== '' ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightActions ? <View style={styles.right}>{rightActions}</View> : null}
    </View>
  );
};
