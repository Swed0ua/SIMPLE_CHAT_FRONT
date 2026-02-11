import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeArea } from './SafeArea';
import { useAppSelector } from '../store/store';
import { useCallback } from 'react';
import { Chat } from '../store/slices/chatSlice';
import { BorderRadius, Spacing } from '../constants/spacing';
import { Colors } from '../constants/colors';

export function ChatItem({ chatItem }: { chatItem: Chat }) {
  const userSymbol = chatItem.title.charAt(0).toUpperCase();
  const renderChatItemAvatar = useCallback(() => {
    return (
      <View style={styles.chatItemAvatar}>
        <Text>{userSymbol}</Text>
      </View>
    );
  }, [chatItem.title]);

  return (
    <View style={styles.chatItem}>
      {renderChatItemAvatar()}
      <Text>{chatItem.title}</Text>
    </View>
  );
}

export default function ChatsScreen() {
  const tabBarHeight = useAppSelector(s => s.layout.tabBarHeight);
  const chats = useAppSelector(s => s.chat.list);

  const renderItem = useCallback(({ item }: { item: Chat }) => {
    return <ChatItem chatItem={item} />;
  }, []);

  const renderChatListFooter = useCallback(() => {
    return <View style={{ height: tabBarHeight + Spacing.sm }} />;
  }, [tabBarHeight]);

  return (
    <SafeArea bottom={false}>
      <View style={styles.container}>
        <Text>Chats</Text>
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListFooterComponent={renderChatListFooter}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },

  // ChatItem
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
