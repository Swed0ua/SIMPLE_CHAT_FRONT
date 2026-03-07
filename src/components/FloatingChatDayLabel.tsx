import React, { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getChatDaySeparatorLabel } from '../utils/timeFormating';
import { SystemMessage } from './ChatMessageRow/SystemMessage';

type FloatingChatDayLabelProps = {
  dateKey: string | null;
  visible: boolean;
  defaultOpacity: number;
  visibleOpacity: number;
  onPress?: (dateKey: string) => void;
};

export function FloatingChatDayLabel({
  dateKey,
  visible,
  defaultOpacity = 0,
  visibleOpacity = 1,
  onPress,
}: FloatingChatDayLabelProps) {
  const { t } = useTranslation();
  const opacity = useRef<Animated.Value>(
    new Animated.Value(defaultOpacity),
  ).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? visibleOpacity : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [visible, visibleOpacity, opacity]);

  if (dateKey == null) return null;

  const displayText = getChatDaySeparatorLabel(dateKey, t);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: 8,
        zIndex: 1000,
        opacity: opacity,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => onPress?.(dateKey)}
        style={{ alignItems: 'center' }}
      >
        <SystemMessage displayText={displayText} />
      </Pressable>
    </Animated.View>
  );
}
