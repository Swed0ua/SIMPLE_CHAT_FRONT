import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { MainStackParamList } from '../../../types/navigation';
import { ROUTES } from '../../../navigation/routesConfig';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useCallback, useEffect, useMemo } from 'react';
import {
  fetchMessagesByChatId,
  loadMoreMessages,
  sendMessage,
  setDraft,
} from '../../../store/slices/messagesSlice';
import { useTheme } from '../../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStyles } from './ChatDetailsScreen.styles';
import ChatDetailsSkeleton from '../../../components/ChatDetailsSkeleton/ChatDetailsSkeleton';
import { ChatType } from '../../../types/chat';
import InputBar from '../../../components/InputBar/InputBar';
import { StickyInputFooter } from '../../../components/Keyboards/StickyInputFooter';
import { ChatMessageRow } from '../../../components/ChatMessageRow/ChatMessageRow';
import { ScreenHeader } from '../../../components/ScreenHeader/ScreenHeader';
import { SystemMessageRow } from '../../../components/ChatMessageRow/SystemMessageRow';
import { buildDisplayList } from '../../../utils/systemMessageUtils';

type ChatDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  typeof ROUTES.ChatDetails
>;
const EMPTY_INDICES: number[] = [];

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

  const chatType =
    useAppSelector(s => s.chat.list.find(c => c.id === chatId)?.type) ??
    ChatType.DIRECT;
  const messages = useAppSelector(s => s.messages.byChatId[chatId]);
  const dayDividerIndices = useAppSelector(
    s => s.messages.dayDividerIndicesByChatId[chatId] ?? EMPTY_INDICES,
  );
  const loading = useAppSelector(s => s.messages.loadingByChatId[chatId]);
  const loadingMore = useAppSelector(
    s => s.messages.loadingMoreByChatId[chatId],
  );
  const draft = useAppSelector(s => s.messages.draftByChatId[chatId]);
  const sending = useAppSelector(s => s.messages.sendingByChatId[chatId]);

  const displayList = useMemo(
    () => buildDisplayList(messages ?? [], dayDividerIndices),
    [messages, dayDividerIndices],
  );

  const hasDisabledInput = useMemo(() => {
    return !!sending || !!loading;
  }, [sending, loading]);

  const handleSubmit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      dispatch(sendMessage({ chatId, text: trimmed }))
        .unwrap()
        .catch(() => {});
    },
    [chatId, dispatch],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      dispatch(setDraft({ chatId, text }));
    },
    [chatId, dispatch],
  );

  const handleEndReached = useCallback(() => {
    dispatch(loadMoreMessages(chatId));
  }, [chatId, dispatch]);

  const listFooter = useMemo(
    () =>
      loadingMore ? (
        <View>
          <ActivityIndicator size="small" />
        </View>
      ) : null,
    [loadingMore],
  );

  const listHeader = useMemo(() => {
    return <View style={styles.listBottomContainer} />;
  }, [styles.listBottomContainer]);

  useEffect(() => {
    dispatch(fetchMessagesByChatId({ chatId }));
  }, [chatId, dispatch]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => _navigation.goBack()}
        title="Chat Details"
        subtitle="Chat Details"
      />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          {loading ? (
            <ChatDetailsSkeleton
              variant={chatType === ChatType.DIRECT ? 'single' : 'multiple'}
            />
          ) : (
            <FlatList
              data={displayList}
              // stickyHeaderIndices={dayDividerIndices.map(i => i + 1)}
              keyExtractor={item => item.id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              scrollEventThrottle={16}
              inverted={true}
              style={styles.listContainer}
              ListFooterComponent={() => listFooter}
              ListHeaderComponent={() => listHeader}
              renderItem={({ item, index }) =>
                item.isSystemMessage ? (
                  <SystemMessageRow message={item} />
                ) : (
                  <ChatMessageRow
                    message={item}
                    index={index}
                    messages={messages}
                    chatType={chatType}
                    currentUserId={'u1'}
                  />
                )
              }
            />
          )}
          <StickyInputFooter bottomInset={insets.bottom}>
            <InputBar
              value={draft}
              onChangeText={handleChangeText}
              onSubmit={handleSubmit}
              disabled={hasDisabledInput}
            />
          </StickyInputFooter>
        </View>
      </View>
    </View>
  );
}
