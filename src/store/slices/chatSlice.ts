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
  avatatUrl?: string;
  createdAt: string;
  createdById?: string | null;
  createdBy?: any;
}

export interface ChatState {
  list: Chat[];
  isLoading: boolean;
  error: string | null;
}

const now = new Date();
const mockChats: Chat[] = [
  {
    id: '1',
    title: 'John Doe',
    type: ChatType.DIRECT,
    lastMessage: 'Hey, how are you?',
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
  list: [
    ...mockChats,
    ...mockChats,
    ...mockChats,
    ...mockChats,
    ...mockChats,
    ...mockChats,
  ], // For testing with more items
  isLoading: false,
  error: null,
};

export const fetchChats = createAsyncThunk<
  Chat[],
  void,
  { state: RootState; rejectValue: string }
>('chat/fetchChats', async (_, { rejectWithValue }) => {
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  return mockChats;
});

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

export const { setChats, setChatsLoading, setChatsError } = chatSlice.actions;
export default chatSlice.reducer;
