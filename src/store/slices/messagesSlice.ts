import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getMockMessages, MOCK_MESSAGES } from '../../mocks/mockMessages';
import { MESSAGES_CONFIG } from '../../config/mesages';
import { ChatType } from '../../types/chat';
import { getDayDividerIndices } from '../../utils/timeFormating';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  deletedAt?: string | null;
  isSystemMessage?: boolean;
  systemMessageData?: SystemMessageData;
}

export type SystemMessageType =
  | 'CreatedRoom'
  | 'AddedMember'
  | 'RemoveMember'
  | 'DayDivider'
  | 'Other';

export type SystemMessageData =
  | { type: 'CreatedRoom'; roomName?: string; createdByUserId?: string }
  | {
      type: 'AddedMember';
      memberId: string;
      memberName?: string;
      addedByUserId?: string;
    }
  | {
      type: 'RemoveMember';
      memberId: string;
      memberName?: string;
      removedByUserId?: string;
    }
  | { type: 'DayDivider'; dateKey: string }
  | { type: 'Other' };

export interface MessagesState {
  sendingByChatId: Record<string, boolean>;
  draftByChatId: Record<string, string>;
  byChatId: Record<string, Message[]>;
  dayDividerIndicesByChatId: Record<string, number[]>;
  chatTypes: Record<string, ChatType>;
  loadingByChatId: Record<string, boolean>;
  loadingMoreByChatId: Record<string, boolean>;
  errorByChatId: Record<string, string | null>;
  hasMoreByChatId: Record<string, boolean>;
}

type SendMessagePayload = { chatId: string; text: string };

type FetchMessagesPayload = {
  chatId: string;
  cursor?: { id: string; createdAt: string } | null;
  chatType?: ChatType | null;
};

const initialState: MessagesState = {
  sendingByChatId: {},
  draftByChatId: {},
  byChatId: {},
  dayDividerIndicesByChatId: {},
  chatTypes: {},
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
  async ({ chatId, cursor = null, chatType = null }: FetchMessagesPayload) => {
    console.log('fetchMessagesByChatId : ', chatId);
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    const messagesMock = getMockMessages(chatType ?? ChatType.DIRECT);
    if (!cursor) {
      return messagesMock
        .slice(0, MESSAGES_CONFIG.initialLoadLimit)
        .map(m => ({ ...m, chatId }));
    }
    const cursorTime = new Date(cursor.createdAt).getTime();
    const olderMessages = messagesMock.filter(m => {
      return new Date(m.createdAt).getTime() < cursorTime;
    });
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

export const sendMessage = createAsyncThunk<
  Message,
  SendMessagePayload,
  { state: RootState; rejectValue: string }
>(
  'messages/sendMessage',
  async ({ chatId, text }: SendMessagePayload, { getState }) => {
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    const userId = getState().auth.user?.id ?? 'u1';
    const message: Message = {
      id: `temp-${Date.now()}`,
      chatId,
      senderId: userId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    return message;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialState,
  reducers: {
    setDraft: (
      state,
      action: PayloadAction<{ chatId: string; text: string }>,
    ) => {
      const { chatId, text } = action.payload;
      state.draftByChatId[chatId] = text;
    },
  },
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
        const list = state.byChatId[chatId] ?? [];
        state.dayDividerIndicesByChatId[chatId] = getDayDividerIndices(list);
        state.errorByChatId[chatId] = null;
      })
      .addCase(fetchMessagesByChatId.rejected, (state, action) => {
        const chatId = action.meta.arg.chatId;

        state.loadingByChatId[chatId] = false;
        state.loadingMoreByChatId[chatId] = false;

        state.errorByChatId[chatId] = action.payload ?? 'Failed to load chats';
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.sendingByChatId[action.meta.arg.chatId] = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const chatId = action.meta.arg.chatId;
        state.sendingByChatId[chatId] = false;
        state.draftByChatId[chatId] = '';
        const list = state.byChatId[chatId] ?? [];
        state.byChatId[chatId] = [action.payload, ...list];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingByChatId[action.meta.arg.chatId] = false;
      });
  },
});

export const { setDraft } = messagesSlice.actions;
export default messagesSlice.reducer;
