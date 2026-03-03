import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export function LoadingPlaceholder() {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.primary,
          width,
          height,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingPlaceholder;
