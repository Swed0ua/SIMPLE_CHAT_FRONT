import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { MOCK_MESSAGES } from '../../mocks/mockMessages';
import { MESSAGES_CONFIG } from '../../config/mesages';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface MessagesState {
  byChatId: Record<string, Message[]>;
  loadingByChatId: Record<string, boolean>;
  loadingMoreByChatId: Record<string, boolean>;
  errorByChatId: Record<string, string | null>;
  hasMoreByChatId: Record<string, boolean>;
}

type FetchMessagesPayload = {
  chatId: string;
  cursor?: { id: string; createdAt: string } | null;
};

const initialState: MessagesState = {
  byChatId: {},
  loadingByChatId: {},
  loadingMoreByChatId: {},
  errorByChatId: {},
  hasMoreByChatId: {},
};

const mockMessages: Omit<Message, 'chatId'>[] = MOCK_MESSAGES;

// TODO: Implement real fetch from backend.
export const fetchMessagesByChatId = createAsyncThunk<
  Message[],
  FetchMessagesPayload,
  { state: RootState; rejectValue: string }
>(
  'messages/fetchMessages',
  async ({ chatId, cursor = null }: FetchMessagesPayload) => {
    console.log('fetchMessagesByChatId : ', chatId);
    await new Promise<void>(resolve => setTimeout(resolve, 5000));
    if (!cursor) {
      console.log('mm : ', mockMessages);

      return mockMessages
        .slice(0, MESSAGES_CONFIG.initialLoadLimit)
        .map(m => ({ ...m, chatId }));
    }
    const cursorTime = new Date(cursor.createdAt).getTime();
    const olderMessages = mockMessages.filter(m => {
      return new Date(m.createdAt).getTime() < cursorTime;
    });
    console.log('===olderMessages : ', olderMessages.length);
    const chunk = olderMessages
      .slice(0, MESSAGES_CONFIG.loadMoreLimit)
      .map(m => ({ ...m, chatId }));
    return chunk;
  },
);

export const loadMoreMessages = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>('messages/loadMore', async (chatId, { getState, dispatch }) => {
  const state = getState().messages;
  const list = state.byChatId[chatId] ?? [];
  const hasMore = state.hasMoreByChatId[chatId] !== false;
  if (!hasMore) return;

  const oldest = list[list.length - 1];

  await dispatch(
    fetchMessagesByChatId({
      chatId,
      cursor: { id: oldest.id, createdAt: oldest.createdAt },
    }),
  ).unwrap();
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMessagesByChatId.pending, (state, action) => {
        const arg = action.meta.arg;
        const chatId = arg.chatId;
        const isLoadingMore = arg.cursor != null;
        const payload = action.payload;

        state.loadingByChatId[chatId] = !isLoadingMore;
        state.loadingMoreByChatId[chatId] = isLoadingMore;
        state.errorByChatId[chatId] = null;
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, action) => {
        const chatId = action.meta.arg.chatId;
        const hasCursor = action.meta.arg.cursor != null;

        state.loadingByChatId[chatId] = false;
        state.loadingMoreByChatId[chatId] = false;

        if (hasCursor) {
          state.byChatId[chatId] = [
            ...(state.byChatId[chatId] ?? []),
            ...action.payload,
          ];
        } else {
          state.byChatId[chatId] = action.payload;
        }
        state.errorByChatId[chatId] = null;
      })
      .addCase(fetchMessagesByChatId.rejected, (state, action) => {
        const chatId = action.meta.arg.chatId;

        state.loadingByChatId[chatId] = false;
        state.loadingMoreByChatId[chatId] = false;

        state.errorByChatId[chatId] = action.payload ?? 'Failed to load chats';
      });
  },
});

export default messagesSlice.reducer;
