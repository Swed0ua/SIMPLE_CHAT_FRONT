import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MainStackParamList } from '../../../types/navigation';
import { ROUTES } from '../../../navigation/routesConfig';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useCallback, useEffect, useMemo } from 'react';
import {
  fetchMessagesByChatId,
  loadMoreMessages,
} from '../../../store/slices/messagesSlice';
import { useTheme } from '../../../context/ThemeContext';
import ChatBubble from '../../../components/ChatBubble/ChatBubble';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyles } from './ChatDetailsScreen.styles';
import { IsInMessagesGroupInterface } from './ChatDetailsScreen.types';
import ChatDetailsSkeleton from '../../../components/ChatDetailsSkeleton/ChatDetailsSkeleton';

type ChatDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  typeof ROUTES.ChatDetails
>;

export default function ChatDetailsScreen({
  route,
  navigation: _navigation,
}: ChatDetailsScreenProps) {
  const dispatch = useAppDispatch();
  const chatId = route.params.chatId;

  const styleTheme = useTheme();
  const { theme } = styleTheme;
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles({ theme, insets }), [theme, insets]);

  const messages = useAppSelector(s => s.messages.byChatId[chatId]);
  const cuurentUserId = useAppSelector(s => s.auth.user?.id);
  const loading = useAppSelector(s => s.messages.loadingByChatId[chatId]);
  const loadingMore = useAppSelector(
    s => s.messages.loadingMoreByChatId[chatId],
  );
  const error = useAppSelector(s => s.messages.errorByChatId[chatId]);

  // TODO: remove this
  // console.log('----------start-----------------');
  // console.log('ChatDetailsScreen', chatId);
  // console.log('messages', messages);
  // console.log('loading', loading);
  // console.log('error', error);
  // console.log('-------------end----------------');

  const handleEndReached = useCallback(() => {
    dispatch(loadMoreMessages(chatId));
  }, [chatId, dispatch]);

  const isInMessagesGroup = (index: number): IsInMessagesGroupInterface => {
    const inMessagesGroup: IsInMessagesGroupInterface = {
      isFirst: true,
      isLast: true,
    };
    const list = messages ?? [];
    const current = list[index];
    if (!current) return inMessagesGroup;

    if (
      index < list.length - 1 &&
      current.senderId === list[index + 1]?.senderId
    ) {
      inMessagesGroup.isFirst = false;
    }
    if (index > 0 && current.senderId === list[index - 1]?.senderId) {
      inMessagesGroup.isLast = false;
    }
    return inMessagesGroup;
  };

  const listFooter = useMemo(
    () =>
      loadingMore ? (
        <View>
          <ActivityIndicator size="small" />
        </View>
      ) : null,
    [loadingMore],
  );

  // const handleScroll = useCallback(
  //   (e: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     const y = e.nativeEvent.contentOffset.y;
  //     const nearTop = y <= MESSAGES_CONFIG.scrollToBottomChatThreshold;
  //     if (nearTop) {
  //       if (!loadMoreTriggeredRef.current && !loading) {
  //         loadMoreTriggeredRef.current = true;
  //         handleEndReached();
  //       }
  //     } else {
  //       loadMoreTriggeredRef.current = false;
  //     }
  //   },
  //   [handleEndReached, loading],
  // );

  useEffect(() => {
    dispatch(fetchMessagesByChatId({ chatId }));
  }, [chatId, dispatch]);

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
      <Text>Chat Details {chatId}</Text>
      <View style={{ flex: 1 }}>
        <ChatDetailsSkeleton />
        <View style={{ height: 100, backgroundColor: 'blue' }} />
        {/* <FlatList
          data={messages}
          keyExtractor={item => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          // onScroll={handleScroll}
          scrollEventThrottle={16}
          inverted={true}
          style={styles.listContainer}
          ListFooterComponent={() => listFooter}
          ListHeaderComponent={() => (
            <View style={styles.listBottomContainer} />
          )}
          renderItem={({ item, index }) => (
            <ChatBubble
              message={item}
              currentUserId={'u1'}
              isInMessagesGroup={isInMessagesGroup(index)}
            />
          )}
        /> */}
      </View>
    </View>
  );
}
