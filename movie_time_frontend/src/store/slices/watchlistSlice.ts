/**
 * Watchlist Slice
 * Manages user's watchlist with localStorage persistence
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/types/movie';

interface WatchlistState {
  movies: Movie[];
}

// Load watchlist from localStorage
const loadFromLocalStorage = (): Movie[] => {
  try {
    const saved = localStorage.getItem('movieflix-watchlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save watchlist to localStorage
const saveToLocalStorage = (movies: Movie[]) => {
  try {
    localStorage.setItem('movieflix-watchlist', JSON.stringify(movies));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
};

const initialState: WatchlistState = {
  movies: loadFromLocalStorage(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    /**
     * Add a movie to the watchlist
     */
    addToWatchlist: (state, action: PayloadAction<Movie>) => {
      const exists = state.movies.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.movies.push(action.payload);
        saveToLocalStorage(state.movies);
      }
    },
    
    /**
     * Remove a movie from the watchlist
     */
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter((m) => m.id !== action.payload);
      saveToLocalStorage(state.movies);
    },
    
    /**
     * Toggle a movie in the watchlist
     */
    toggleWatchlist: (state, action: PayloadAction<Movie>) => {
      const index = state.movies.findIndex((m) => m.id === action.payload.id);
      if (index >= 0) {
        state.movies.splice(index, 1);
      } else {
        state.movies.push(action.payload);
      }
      saveToLocalStorage(state.movies);
    },
    
    /**
     * Clear the entire watchlist
     */
    clearWatchlist: (state) => {
      state.movies = [];
      saveToLocalStorage([]);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

// Selectors
export const selectWatchlist = (state: { watchlist: WatchlistState }) => state.watchlist.movies;
export const selectIsInWatchlist = (movieId: string) => (state: { watchlist: WatchlistState }) =>
  state.watchlist.movies.some((m) => m.id === movieId);
