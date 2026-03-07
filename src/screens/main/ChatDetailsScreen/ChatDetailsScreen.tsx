import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { MainStackParamList } from '../../../types/navigation';
import { ROUTES } from '../../../navigation/routesConfig';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  fetchMessagesByChatId,
  loadMoreMessages,
  Message,
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
import { getDayKey } from '../../../utils/timeFormating';
import { FloatingChatDayLabel } from '../../../components/FloatingChatDayLabel';
import {
  buildDividerPositions,
  DividerPosition,
  getFloatingDayKeyFromPositions,
} from '../../../utils/floatingDayUtils';

type ChatDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  typeof ROUTES.ChatDetails
>;
const EMPTY_INDICES: number[] = [];
const LABEL_HIDE_DELAY_MS = 2000;
/** Label is fixed at viewport top, so there's an offset relative to the divider position in the list. */
const LABEL_NEAR_DIVIDER_TOP_PX = 100;
const LABEL_NEAR_DIVIDER_BOTTOM_PX = 10;
const LABEL_DEFAULT_OPACITY = 0;
const LABEL_VISIBLE_OPACITY = 1;
const END_REACHED_THRESHOLD = 0.3;
const SCROLL_EVENT_THROTTLE_MS = 50;

type ChatMessageListRowProps = {
  item: Message;
  index: number;
  messages: Message[];
  chatType: ChatType;
  currentUserId: string | undefined;
  onLayout: (index: number, height: number) => void;
};

const ChatMessageListRow = memo(function ChatMessageListRow({
  item,
  index,
  messages,
  chatType,
  currentUserId,
  onLayout,
}: ChatMessageListRowProps) {
  return item.isSystemMessage ? (
    <View
      onLayout={e => onLayout(index, e.nativeEvent.layout.height)}
      collapsable={false}
    >
      <SystemMessageRow message={item} />
    </View>
  ) : (
    <View
      onLayout={e => onLayout(index, e.nativeEvent.layout.height)}
      collapsable={false}
    >
      <ChatMessageRow
        message={item}
        index={index}
        messages={messages}
        chatType={chatType}
        currentUserId={currentUserId}
      />
    </View>
  );
});

export type ChatMessageListRef = {
  scrollToIndex: (params: { index: number; animated?: boolean }) => void;
};

type ChatMessageListProps = {
  data: Message[];
  messages: Message[];
  chatType: ChatType;
  currentUserId: string | undefined;
  listContainerStyle: object;
  listFooter: React.ReactElement | null;
  listHeader: React.ReactElement;
  onScroll: (e: { nativeEvent: { contentOffset: { y: number } } }) => void;
  onContentSizeChange: (w: number, h: number) => void;
  onItemLayout: (index: number, height: number) => void;
  onEndReached: () => void;
  onListLayout: (height: number) => void;
};

const ChatMessageList = memo(
  forwardRef<ChatMessageListRef, ChatMessageListProps>(function ChatMessageList(
    {
      data,
      messages,
      chatType,
      currentUserId,
      listContainerStyle,
      listFooter,
      listHeader,
      onScroll,
      onContentSizeChange,
      onItemLayout,
      onEndReached,
      onListLayout,
    },
    ref,
  ) {
    const flatListRef = useRef<FlatList<Message>>(null);
    useImperativeHandle(ref, () => ({
      scrollToIndex: params => {
        flatListRef.current?.scrollToIndex({
          ...params,
          viewPosition: 1,
        });
      },
    }));
    const renderItem = useCallback(
      ({ item, index }: { item: Message; index: number }) => (
        <ChatMessageListRow
          item={item}
          index={index}
          messages={messages}
          chatType={chatType}
          currentUserId={currentUserId}
          onLayout={onItemLayout}
        />
      ),
      [messages, chatType, currentUserId, onItemLayout],
    );
    const keyExtractor = useCallback((item: Message) => item.id, []);
    return (
      <View
        style={{ flex: 1, overflow: 'hidden' }}
        onLayout={e => onListLayout(e.nativeEvent.layout.height)}
      >
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          onEndReached={onEndReached}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          scrollEventThrottle={SCROLL_EVENT_THROTTLE_MS}
          inverted
          style={listContainerStyle}
          ListFooterComponent={listFooter}
          ListHeaderComponent={listHeader}
        />
      </View>
    );
  }),
);

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

  const itemHeightsRef = useRef<Record<number, number>>({});
  const [contentHeight, setContentHeight] = useState(0);
  const dividerPositionsRef = useRef<DividerPosition[]>([]);
  const listHeightRef = useRef(0);
  const [floatingDayKey, setFloatingDayKey] = useState<string | null>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const hideLabelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const listRef = useRef<ChatMessageListRef>(null);

  const draft = useAppSelector(s => s.messages.draftByChatId[chatId]);
  const sending = useAppSelector(s => s.messages.sendingByChatId[chatId]);
  const currentUserId = useAppSelector(s => s.auth.user?.id);

  const displayList = useMemo(
    () => buildDisplayList(messages ?? [], dayDividerIndices),
    [messages, dayDividerIndices],
  );

  const showLabelAndScheduleHide = useCallback(() => {
    if (hideLabelTimeoutRef.current) clearTimeout(hideLabelTimeoutRef.current);
    setLabelVisible(true);
    hideLabelTimeoutRef.current = setTimeout(
      () => setLabelVisible(false),
      LABEL_HIDE_DELAY_MS,
    );
  }, []);

  const hasDisabledInput = useMemo(() => {
    return !!sending || !!loading;
  }, [sending, loading]);

  const handleSubmit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      dispatch(sendMessage({ chatId, text: trimmed }))
        .unwrap()
        .catch(err => {
          console.error('sendMessage failed', err);
        });
    },
    [chatId, dispatch],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      dispatch(setDraft({ chatId, text }));
    },
    [chatId, dispatch],
  );

  const handleContentSizeChange = useCallback((_w: number, h: number) => {
    setContentHeight(h);
  }, []);

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      const viewportTop =
        contentHeight - e.nativeEvent.contentOffset.y - listHeightRef.current;
      const { dateKey, distanceToNearestDivider } =
        getFloatingDayKeyFromPositions(
          Math.max(0, Math.min(contentHeight, viewportTop)),
          dividerPositionsRef.current,
        );
      setFloatingDayKey(prev => (prev === dateKey ? prev : dateKey));

      const isNearDivider =
        (distanceToNearestDivider > 0 &&
          distanceToNearestDivider <= LABEL_NEAR_DIVIDER_TOP_PX) ||
        (distanceToNearestDivider < 0 &&
          distanceToNearestDivider >= -LABEL_NEAR_DIVIDER_BOTTOM_PX);

      if (!isNearDivider) {
        showLabelAndScheduleHide();
      } else {
        setLabelVisible(false);
        if (hideLabelTimeoutRef.current) {
          clearTimeout(hideLabelTimeoutRef.current);
          hideLabelTimeoutRef.current = null;
        }
      }
    },
    [contentHeight, showLabelAndScheduleHide],
  );

  const handleItemLayout = useCallback((index: number, height: number) => {
    if (itemHeightsRef.current[index] === height) return;
    itemHeightsRef.current = { ...itemHeightsRef.current, [index]: height };
  }, []);

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

  const fallbackDayKey = useMemo(() => {
    const idx = dayDividerIndices[0];
    if (idx == null) return null;
    const sd = displayList[idx]?.systemMessageData;
    return sd?.type === 'DayDivider' && 'dateKey' in sd
      ? (sd as { dateKey: string }).dateKey
      : null;
  }, [dayDividerIndices, displayList]);

  const handleFloatingLabelPress = useCallback(
    (dateKey: string) => {
      for (let i = 0; i < dayDividerIndices.length; i++) {
        const divIdx = dayDividerIndices[i];
        const item = displayList[divIdx];
        if (!item?.createdAt) continue;
        if (getDayKey(item.createdAt) === dateKey) {
          listRef.current?.scrollToIndex({ index: divIdx, animated: true });
          return;
        }
      }
      listRef.current?.scrollToIndex({
        index: displayList.length - 1,
        animated: true,
      });
    },
    [dayDividerIndices, displayList],
  );

  useEffect(() => {
    return () => {
      if (hideLabelTimeoutRef.current)
        clearTimeout(hideLabelTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchMessagesByChatId({ chatId }));
  }, [chatId, dispatch]);

  useEffect(() => {
    dividerPositionsRef.current = buildDividerPositions(
      itemHeightsRef.current,
      contentHeight,
      dayDividerIndices,
      displayList,
    );
  }, [contentHeight, dayDividerIndices, displayList]);

  useEffect(() => {
    itemHeightsRef.current = {};
  }, [chatId]);

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
            <>
              <ChatMessageList
                ref={listRef}
                data={displayList}
                messages={messages ?? []}
                chatType={chatType}
                currentUserId={currentUserId}
                listContainerStyle={styles.listContainer}
                listFooter={listFooter}
                listHeader={listHeader}
                onScroll={handleScroll}
                onContentSizeChange={handleContentSizeChange}
                onItemLayout={handleItemLayout}
                onEndReached={handleEndReached}
                onListLayout={h => {
                  listHeightRef.current = h;
                }}
              />
              <FloatingChatDayLabel
                dateKey={floatingDayKey ?? fallbackDayKey}
                visible={labelVisible}
                defaultOpacity={LABEL_DEFAULT_OPACITY}
                visibleOpacity={LABEL_VISIBLE_OPACITY}
                onPress={handleFloatingLabelPress}
              />
            </>
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
