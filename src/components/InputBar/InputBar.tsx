import React, { useCallback } from 'react';
import { Pressable, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './InputBar.styles';
import { IconSend } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type InputBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  submitLabel?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

export default function InputBar({
  value,
  onChangeText,
  onSubmit,
  disabled = false,
  placeholder,
  submitLabel,
  style,
  inputStyle,
}: InputBarProps) {
  const { theme } = useTheme();
  const inset = useSafeAreaInsets();
  const styles = getStyles({ theme, insets: inset });
  const canSubmit = !disabled && value.trim().length > 0;
  const handleSubmit = useCallback(() => {
    const trimmedText = value.trim();
    if (!trimmedText || !canSubmit) return;
    onSubmit(trimmedText);
  }, [value, onSubmit, canSubmit]);
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        placeholderTextColor={theme.colors.text.tertiary}
        editable={!disabled}
        multiline
        onSubmitEditing={handleSubmit}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          !canSubmit && pressed && styles.submitButtonDisabled,
        ]}
      >
        <IconSend />
      </Pressable>
    </View>
  );
}
