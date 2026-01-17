/**
 * Redux Store Configuration
 * Centralized state management for the application
 */

import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import watchlistReducer from './slices/watchlistSlice';
import searchReducer from './slices/searchSlice';
import filtersReducer from './slices/filtersSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchlist: watchlistReducer,
    search: searchReducer,
    filters: filtersReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
