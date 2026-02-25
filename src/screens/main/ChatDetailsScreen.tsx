import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  Text,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MainStackParamList } from '../../types/navigation';
import { ROUTES } from '../../navigation/routesConfig';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useCallback, useEffect, useRef } from 'react';
import {
  fetchMessagesByChatId,
  loadMoreMessages,
} from '../../store/slices/messagesSlice';
import { MESSAGES_CONFIG } from '../../config/mesages';

type ChatDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  typeof ROUTES.ChatDetails
>;

export default function ChatDetailsScreen({
  route,
  navigation: _navigation,
}: ChatDetailsScreenProps) {
  const dispatch = useAppDispatch();
  const loadMoreTriggeredRef = useRef(false);

  const chatId = route.params.chatId;
  const messages = useAppSelector(s => s.messages.byChatId[chatId]);
  const loading = useAppSelector(s => s.messages.loadingByChatId[chatId]);
  const error = useAppSelector(s => s.messages.errorByChatId[chatId]);

  // TODO: remove this
  console.log('----------start-----------------');
  console.log('ChatDetailsScreen', chatId);
  console.log('messages', messages);
  console.log('loading', loading);
  console.log('error', error);
  console.log('-------------end----------------');

  const handleEndReached = useCallback(() => {
    dispatch(loadMoreMessages(chatId));
  }, [chatId, dispatch]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const nearTop = y <= MESSAGES_CONFIG.scrollToBottomChatThreshold;
      if (nearTop) {
        if (!loadMoreTriggeredRef.current && !loading) {
          loadMoreTriggeredRef.current = true;
          handleEndReached();
        }
      } else {
        loadMoreTriggeredRef.current = false;
      }
    },
    [handleEndReached, loading],
  );

  useEffect(() => {
    dispatch(fetchMessagesByChatId({ chatId }));
  }, [chatId, dispatch]);

  return (
    <View>
      <Text>Hello world</Text>
      <Text>Chat Details {chatId}</Text>
      <View>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[{ backgroundColor: 'red' }]}>
              <Text style={[{ color: 'white' }]}>{item.text}</Text>
              <Text style={[{ color: 'white' }]}>{item.createdAt}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
