import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { MainStackParamList } from '../../../types/navigation';
import { ROUTES } from '../../../navigation/routesConfig';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
const LABEL_NEAR_DIVIDER_THRESHOLD_PX = 50;
const LABEL_DEFAULT_OPACITY = 0;
const LABEL_VISIBLE_OPACITY = 1;

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

  const [itemHeights, setItemHeights] = useState<Record<number, number>>({});
  const [contentHeight, setContentHeight] = useState(0);
  const dividerPositionsRef = useRef<DividerPosition[]>([]);
  const listHeightRef = useRef(0);
  const [floatingDayKey, setFloatingDayKey] = useState<string | null>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const hideLabelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const draft = useAppSelector(s => s.messages.draftByChatId[chatId]);
  const sending = useAppSelector(s => s.messages.sendingByChatId[chatId]);

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

      if (
        Math.abs(distanceToNearestDivider) >= LABEL_NEAR_DIVIDER_THRESHOLD_PX
      ) {
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
    setItemHeights(prev => {
      if (prev[index] === height) return prev;
      return { ...prev, [index]: height };
    });
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

  const renderChatArea = useCallback(() => {
    return (
      <View
        style={{ flex: 1, overflow: 'hidden' }}
        onLayout={e => {
          listHeightRef.current = e.nativeEvent.layout.height;
        }}
      >
        <FlatList
          data={displayList}
          keyExtractor={item => item.id}
          onContentSizeChange={handleContentSizeChange}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          scrollEventThrottle={50}
          onScroll={handleScroll}
          inverted={true}
          style={styles.listContainer}
          ListFooterComponent={() => listFooter}
          ListHeaderComponent={() => listHeader}
          renderItem={({ item, index: listIndex }) =>
            item.isSystemMessage ? (
              <View
                onLayout={e => {
                  const { height } = e.nativeEvent.layout;
                  handleItemLayout(listIndex, height);
                }}
              >
                <SystemMessageRow message={item} />
              </View>
            ) : (
              <View
                onLayout={e => {
                  const { height } = e.nativeEvent.layout;
                  handleItemLayout(listIndex, height);
                }}
              >
                <ChatMessageRow
                  message={item}
                  index={listIndex}
                  messages={messages}
                  chatType={chatType}
                  currentUserId={'u1'}
                />
              </View>
            )
          }
        />
        <FloatingChatDayLabel
          dateKey={floatingDayKey ?? fallbackDayKey}
          visible={labelVisible}
          defaultOpacity={LABEL_DEFAULT_OPACITY}
          visibleOpacity={LABEL_VISIBLE_OPACITY}
        />
      </View>
    );
  }, [
    chatType,
    displayList,
    fallbackDayKey,
    floatingDayKey,
    handleContentSizeChange,
    handleEndReached,
    handleItemLayout,
    handleScroll,
    listFooter,
    listHeader,
    labelVisible,
    messages,
    styles.listContainer,
  ]);

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
      itemHeights,
      contentHeight,
      dayDividerIndices,
      displayList,
    );
  }, [itemHeights, contentHeight, dayDividerIndices, displayList]);

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
            renderChatArea()
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
