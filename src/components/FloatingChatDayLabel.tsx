import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getChatDaySeparatorLabel } from '../utils/timeFormating';
import { SystemMessage } from './ChatMessageRow/SystemMessage';

type FloatingChatDayLabelProps = {
  dateKey: string | null;
  visible: boolean;
  defaultOpacity: number;
  visibleOpacity: number;
};

export function FloatingChatDayLabel({
  dateKey,
  visible,
  defaultOpacity = 0,
  visibleOpacity = 1,
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
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: opacity,
      }}
    >
      <SystemMessage displayText={displayText} />
    </Animated.View>
  );
}
