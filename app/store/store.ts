import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['messages/addMessage'],
        ignoredPaths: ['messages.messages'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;