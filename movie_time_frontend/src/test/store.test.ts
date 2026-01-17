/**
 * Unit tests for Redux slices
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import watchlistReducer, {
  addToWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
  clearWatchlist,
} from '@/store/slices/watchlistSlice';
import searchReducer, {
  setQuery,
  setSearchType,
  clearSearch,
} from '@/store/slices/searchSlice';
import filtersReducer, {
  setGenreFilter,
  setActorFilter,
  setDirectorFilter,
  clearAllFilters,
} from '@/store/slices/filtersSlice';
import themeReducer, { setTheme, toggleTheme } from '@/store/slices/themeSlice';
import { Movie } from '@/types/movie';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock movie data
const mockMovie: Movie = {
  id: '1',
  title: 'Test Movie',
  releaseYear: 2024,
  rating: 8.5,
  director: { id: 'd1', name: 'Test Director' },
  actors: [{ id: 'a1', name: 'Test Actor' }],
  genres: [{ id: 'g1', name: 'Action' }],
};

describe('watchlistSlice', () => {
  const initialState = { movies: [] };

  it('should add a movie to watchlist', () => {
    const state = watchlistReducer(initialState, addToWatchlist(mockMovie));
    expect(state.movies).toHaveLength(1);
    expect(state.movies[0].id).toBe('1');
  });

  it('should not add duplicate movies', () => {
    const stateWithMovie = { movies: [mockMovie] };
    const state = watchlistReducer(stateWithMovie, addToWatchlist(mockMovie));
    expect(state.movies).toHaveLength(1);
  });

  it('should remove a movie from watchlist', () => {
    const stateWithMovie = { movies: [mockMovie] };
    const state = watchlistReducer(stateWithMovie, removeFromWatchlist('1'));
    expect(state.movies).toHaveLength(0);
  });

  it('should toggle a movie in watchlist', () => {
    // Add
    let state = watchlistReducer(initialState, toggleWatchlist(mockMovie));
    expect(state.movies).toHaveLength(1);

    // Remove
    state = watchlistReducer(state, toggleWatchlist(mockMovie));
    expect(state.movies).toHaveLength(0);
  });

  it('should clear the entire watchlist', () => {
    const stateWithMovies = { movies: [mockMovie, { ...mockMovie, id: '2' }] };
    const state = watchlistReducer(stateWithMovies, clearWatchlist());
    expect(state.movies).toHaveLength(0);
  });
});

describe('searchSlice', () => {
  const initialState = {
    query: '',
    searchType: 'title' as const,
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
  };

  it('should set search query', () => {
    const state = searchReducer(initialState, setQuery('test'));
    expect(state.query).toBe('test');
  });

  it('should set search type', () => {
    const state = searchReducer(initialState, setSearchType('actor'));
    expect(state.searchType).toBe('actor');
  });

  it('should clear search', () => {
    const stateWithSearch = { ...initialState, query: 'test', hasSearched: true };
    const state = searchReducer(stateWithSearch, clearSearch());
    expect(state.query).toBe('');
    expect(state.hasSearched).toBe(false);
  });
});

describe('filtersSlice', () => {
  const initialState = {
    activeFilters: {},
    selectedGenre: null,
    selectedActor: null,
    selectedDirector: null,
  };

  it('should set genre filter', () => {
    const state = filtersReducer(initialState, setGenreFilter('action'));
    expect(state.selectedGenre).toBe('action');
    expect(state.activeFilters.genreId).toBe('action');
  });

  it('should set actor filter', () => {
    const state = filtersReducer(initialState, setActorFilter('actor1'));
    expect(state.selectedActor).toBe('actor1');
    expect(state.activeFilters.actorId).toBe('actor1');
  });

  it('should set director filter', () => {
    const state = filtersReducer(initialState, setDirectorFilter('director1'));
    expect(state.selectedDirector).toBe('director1');
    expect(state.activeFilters.directorId).toBe('director1');
  });

  it('should clear all filters', () => {
    const stateWithFilters = {
      activeFilters: { genreId: 'action', actorId: 'actor1' },
      selectedGenre: 'action',
      selectedActor: 'actor1',
      selectedDirector: null,
    };
    const state = filtersReducer(stateWithFilters, clearAllFilters());
    expect(state.activeFilters).toEqual({});
    expect(state.selectedGenre).toBeNull();
    expect(state.selectedActor).toBeNull();
  });
});

describe('themeSlice', () => {
  const initialState = { current: 'dark' as const };

  it('should set theme', () => {
    const state = themeReducer(initialState, setTheme('light'));
    expect(state.current).toBe('light');
  });

  it('should toggle theme', () => {
    let state = themeReducer(initialState, toggleTheme());
    expect(state.current).toBe('light');

    state = themeReducer(state, toggleTheme());
    expect(state.current).toBe('dark');
  });
});
