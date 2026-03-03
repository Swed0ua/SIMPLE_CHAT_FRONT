import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  Text,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { APP_NAME, APP_VERSION } from '../../../config/main';

export function LoadingPlaceholder() {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary[700],
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
      <ActivityIndicator size="large" color={theme.colors.primary[50]} />
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.primary[200] }]}>
          {APP_NAME}
        </Text>
        <Text
          style={[styles.footerVersion, { color: theme.colors.primary[300] }]}
        >
          v{APP_VERSION}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerVersion: {
    fontSize: 12,
    opacity: 0.9,
  },
});

export default LoadingPlaceholder;
