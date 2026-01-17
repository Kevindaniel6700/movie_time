/**
 * Movies Slice
 * Manages movie data fetched from backend APIs
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieDetails, Genre, FilterParams } from '@/types/movie';
import { movieApi, genreApi } from '@/services/api';

interface MoviesState {
  featuredMovies: Movie[];
  moviesByGenre: Record<string, Movie[]>;
  currentMovie: MovieDetails | null;
  relatedMovies: Movie[];
  genres: Genre[];
  allMovies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  featuredMovies: [],
  moviesByGenre: {},
  currentMovie: null,
  relatedMovies: [],
  genres: [],
  allMovies: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchFeaturedMovies = createAsyncThunk(
  'movies/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await movieApi.getFeaturedMovies();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async (genreId: string, { rejectWithValue }) => {
    try {
      const movies = await movieApi.getMoviesByGenre(genreId);
      return { genreId, movies };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId: string, { rejectWithValue }) => {
    try {
      return await movieApi.getMovieById(movieId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRelatedMovies = createAsyncThunk(
  'movies/fetchRelated',
  async (movieId: string, { rejectWithValue }) => {
    try {
      return await movieApi.getRelatedMovies(movieId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      return await genreApi.getGenres();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async (filters: FilterParams | undefined, { rejectWithValue }) => {
    try {
      return await movieApi.getMovies(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
      state.relatedMovies = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Featured movies
    builder
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.featuredMovies = action.payload;
      })
      .addCase(fetchFeaturedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Movies by genre
    builder
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesByGenre[action.payload.genreId] = action.payload.movies;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Movie details
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Related movies
    builder
      .addCase(fetchRelatedMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.relatedMovies = action.payload;
      });

    // Genres
    builder
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.genres = action.payload;
      });

    // All movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.allMovies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentMovie, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
