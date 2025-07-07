import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sources?: string[];
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
}

const initialState: MessageState = {
  messages: [],
  isLoading: false,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateMessage: (state, action: PayloadAction<{ id: string; content: string; sources?: string[] }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
        if (action.payload.sources) {
          message.sources = action.payload.sources;
        }
      }
    },
  },
});

export const { addMessage, setLoading, clearMessages, updateMessage } = messageSlice.actions;
export default messageSlice.reducer;