import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getChatDaySeparatorLabel } from '../utils/timeFormating';
import { SystemMessage } from './ChatMessageRow/SystemMessage';

type FloatingChatDayLabelProps = {
  dateKey: string | null;
};

export function FloatingChatDayLabel({ dateKey }: FloatingChatDayLabelProps) {
  const { t } = useTranslation();

  if (dateKey == null) return null;

  const displayText = getChatDaySeparatorLabel(dateKey, t);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: 8,
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: 0.8,
      }}
    >
      <SystemMessage displayText={displayText} />
    </View>
  );
}
