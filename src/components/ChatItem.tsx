import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Spacing } from '../constants/spacing';
import { Colors } from '../constants/colors';
import { useCallback } from 'react';
import { Chat } from '../store/slices/chatSlice';

type ChatItemProps = {
  chatItem: Chat;
  onPress: () => void;
};

export default function ChatItem({ chatItem, onPress }: ChatItemProps) {
  const userSymbol = chatItem.title.charAt(0).toUpperCase();
  const renderChatItemAvatar = useCallback(() => {
    return (
      <View style={styles.chatItemAvatar}>
        <Text>{userSymbol}</Text>
      </View>
    );
  }, [chatItem.title]);

  return (
    <Pressable style={styles.chatItem} onPress={onPress}>
      {renderChatItemAvatar()}
      <Text>{chatItem.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'orange',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  chatItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
  },
});
