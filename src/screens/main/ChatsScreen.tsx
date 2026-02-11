import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeArea } from '../../components/SafeArea';
import { useAppSelector } from '../../store/store';
import { useCallback } from 'react';
import { Chat } from '../../store/slices/chatSlice';
import { Spacing } from '../../constants/spacing';
import ChatItem from '../../components/ChatItem/ChatItem';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp } from '../../types/navigation';
import { ROUTES } from '../../navigation/routesConfig';
import { MainScreenWrapper } from '../../components/MainScreenWrapper';

export default function ChatsScreen() {
  const tabBarHeight = useAppSelector(s => s.layout.tabBarHeight);
  const chats = useAppSelector(s => s.chat.list);

  const navigation = useNavigation<MainNavigationProp>();

  const handleChatItemPress = useCallback(
    (chatId: string) => {
      navigation.navigate(ROUTES.ChatDetails, { chatId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Chat }) => {
      return (
        <ChatItem
          chatItem={item}
          onPress={() => handleChatItemPress(item.id)}
        />
      );
    },
    [handleChatItemPress],
  );

  const renderChatListFooter = useCallback(() => {
    return <View style={{ height: tabBarHeight + Spacing.sm }} />;
  }, [tabBarHeight]);

  return (
    <MainScreenWrapper>
      <SafeArea bottom={false}>
        <View style={styles.container}>
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListFooterComponent={renderChatListFooter}
          />
        </View>
      </SafeArea>
    </MainScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
