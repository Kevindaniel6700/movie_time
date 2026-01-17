/**
 * Search Slice
 * Manages search state and results from backend API
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SearchParams } from '@/types/movie';
import { movieApi } from '@/services/api';

interface SearchState {
  query: string;
  searchType: 'title' | 'actor' | 'director';
  results: Movie[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const initialState: SearchState = {
  query: '',
  searchType: 'title',
  results: [],
  loading: false,
  error: null,
  hasSearched: false,
};

// Async thunk for search - calls backend API
export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      return await movieApi.searchMovies(params);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchType: (state, action: PayloadAction<'title' | 'actor' | 'director'>) => {
      state.searchType = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.hasSearched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.results = action.payload;
        state.hasSearched = true;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasSearched = true;
      });
  },
});

export const { setQuery, setSearchType, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
