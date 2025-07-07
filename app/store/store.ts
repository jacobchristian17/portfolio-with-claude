import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
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