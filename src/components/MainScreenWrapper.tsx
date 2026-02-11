import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function MainScreenWrapper({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.theme.colors.background.primary,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
}
