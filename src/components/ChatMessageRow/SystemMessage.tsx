import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type SystemMessageProps = {
  displayText: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

export function SystemMessage({
  displayText,
  children,
  style,
  textStyle,
}: SystemMessageProps) {
  const { theme } = useTheme();
  return (
    <View style={[{ alignItems: 'center', paddingVertical: 8 }]}>
      <View
        style={[
          {
            alignItems: 'center',
            backgroundColor: theme.colors.border.default,
            paddingVertical: theme.spacing.xs + 2,
            paddingHorizontal: theme.spacing.sm + 4,
            borderRadius: 90,
            maxWidth: '80%',
          },
          style,
        ]}
      >
        <Text
          style={[
            {
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.primary,
              opacity: 0.6,
            },
            textStyle,
          ]}
        >
          {displayText}
        </Text>
        {children}
      </View>
    </View>
  );
}
