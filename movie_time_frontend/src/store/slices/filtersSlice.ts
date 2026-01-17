/**
 * Filters Slice
 * Manages filter state for backend API filtering
 * Note: All filtering is done server-side
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterParams } from '@/types/movie';

interface FiltersState {
  activeFilters: FilterParams;
  selectedGenre: string | null;
  selectedActor: string | null;
  selectedDirector: string | null;
}

const initialState: FiltersState = {
  activeFilters: {},
  selectedGenre: null,
  selectedActor: null,
  selectedDirector: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setGenreFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedGenre = action.payload;
      state.activeFilters.genreId = action.payload || undefined;
    },
    setActorFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedActor = action.payload;
      state.activeFilters.actorId = action.payload || undefined;
    },
    setDirectorFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedDirector = action.payload;
      state.activeFilters.directorId = action.payload || undefined;
    },
    clearAllFilters: (state) => {
      state.activeFilters = {};
      state.selectedGenre = null;
      state.selectedActor = null;
      state.selectedDirector = null;
    },
  },
});

export const { setGenreFilter, setActorFilter, setDirectorFilter, clearAllFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
