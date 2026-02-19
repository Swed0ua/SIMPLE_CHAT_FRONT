import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat';
import { RootState } from '../store';

export interface Chat {
  id: string;
  title: string;
  type: ChatType;
  lastMessage?: string | null;
  lastMessageId?: string | null;
  lastMessageAt?: string | null;
  avatarUrl?: string;
  createdAt: string;
  createdById?: string | null;
  createdBy?: any;
}

// TODO: temporary type for updating a single list item (id required).
export type ChatUpdateItem = Pick<Chat, 'id'> & Partial<Omit<Chat, 'id'>>;

export interface ChatState {
  list: Chat[];
  isLoading: boolean;
  error: string | null;
}

const now = new Date();
const mockChats: Chat[] = [
  {
    id: '1',
    title: 'John Doe \n dasad asdassdsdadasdds',
    type: ChatType.DIRECT,
    lastMessage:
      'Hey, \n how are you? And you / i am okay/ Heh today is good day',
    lastMessageId: 'msg-1',
    lastMessageAt: now.toISOString(),
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    createdById: 'user-2',
  },
  {
    id: '2',
    title: 'Jane Smith',
    type: ChatType.DIRECT,
    lastMessage: 'See you tomorrow',
    lastMessageId: 'msg-2',
    lastMessageAt: new Date(now.getTime() - 3600000).toISOString(),
    createdAt: new Date(now.getTime() - 172800000).toISOString(),
    createdById: 'user-3',
  },
  {
    id: '3',
    title: 'Dev Team',
    type: ChatType.GROUP,
    lastMessage: 'PR approved',
    lastMessageId: 'msg-3',
    lastMessageAt: new Date(now.getTime() - 7200000).toISOString(),
    createdAt: new Date(now.getTime() - 259200000).toISOString(),
    createdById: 'user-1',
  },
];

const initialState: ChatState = {
  list: [],
  isLoading: false,
  error: null,
};

// TODO: move to dedicated selectors folder
export const fetchChats = createAsyncThunk<
  Chat[],
  void,
  { state: RootState; rejectValue: string }
>('chat/fetchChats', async (_, { rejectWithValue }) => {
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  return mockChats;
});

export function sortChatsByLastActivity<
  T extends Pick<Chat, 'lastMessageAt' | 'createdAt'>,
>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const aLast = a.lastMessageAt ?? null;
    const bLast = b.lastMessageAt ?? null;

    if (!aLast && !bLast) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (!aLast) return 1;
    if (!bLast) return -1;

    return new Date(bLast).getTime() - new Date(aLast).getTime();
  });
}
// -----------------------------

// TODO: Implement real fetch from backend.
const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.list = action.payload;
      state.error = null;
    },
    setChatsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setChatsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateChatListElement: (state, action: PayloadAction<ChatUpdateItem>) => {
      const item = action.payload;
      const chat = state.list.find(c => c.id === item.id);
      if (chat) {
        Object.assign(chat, item);
        state.list = sortChatsByLastActivity([...state.list]);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChats.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to load chats';
      });
  },
});

export const {
  setChats,
  setChatsLoading,
  setChatsError,
  updateChatListElement,
} = chatSlice.actions;
export default chatSlice.reducer;
