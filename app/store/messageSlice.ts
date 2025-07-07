import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sources?: string[];
  ragContext?: {
    query: string;
    relevantDocuments: Array<{
      title: string;
      content: string;
      similarity: number;
      category: string;
    }>;
    selectedIndexes: string[];
  };
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  ragSettings: {
    enabled: boolean;
    selectedIndexes: ('work' | 'school' | 'about_me')[];
  };
}

const initialState: MessageState = {
  messages: [],
  isLoading: false,
  ragSettings: {
    enabled: true,
    selectedIndexes: ['work', 'school', 'about_me'],
  },
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
    updateRAGSettings: (state, action: PayloadAction<{ enabled: boolean; selectedIndexes: ('work' | 'school' | 'about_me')[] }>) => {
      state.ragSettings = action.payload;
    },
    toggleRAGIndex: (state, action: PayloadAction<'work' | 'school' | 'about_me'>) => {
      const index = action.payload;
      const currentIndexes = state.ragSettings.selectedIndexes;
      if (currentIndexes.includes(index)) {
        state.ragSettings.selectedIndexes = currentIndexes.filter(i => i !== index);
      } else {
        state.ragSettings.selectedIndexes.push(index);
      }
    },
  },
});

export const { addMessage, setLoading, clearMessages, updateMessage, updateRAGSettings, toggleRAGIndex } = messageSlice.actions;
export default messageSlice.reducer;