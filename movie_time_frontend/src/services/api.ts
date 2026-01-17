/**
 * API Service Layer
 * Handles all HTTP requests to the backend
 * All filtering and searching is done server-side
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  Movie,
  MovieDetails,
  Actor,
  Director,
  Genre,
  SearchParams,
  FilterParams,
  ApiError
} from '@/types/movie';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the standard response format { success, message, data }
    if (response.data && response.data.success !== undefined) {
      // If success is false, strictly it should have been an error status, 
      // but if status is 200 with success: false, treat as error?
      // The backend returns success: true for 200.
      if (response.data.data !== undefined) {
        response.data = response.data.data;
      }
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(apiError);
  }
);

/**
 * Movie API endpoints
 */
export const movieApi = {
  /**
   * Fetch all movies with optional filters
   * Filtering is performed on the backend
   */
  getMovies: async (filters?: FilterParams): Promise<Movie[]> => {
    const params = new URLSearchParams();
    if (filters?.genreId) params.append('genreId', filters.genreId);
    if (filters?.actorId) params.append('actorId', filters.actorId);
    if (filters?.directorId) params.append('directorId', filters.directorId);

    const response = await apiClient.get<Movie[]>(`/movies?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetch featured movies for hero section
   */
  getFeaturedMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/featured');
    return response.data;
  },

  /**
   * Fetch movie details by ID
   */
  getMovieById: async (id: string): Promise<MovieDetails> => {
    const response = await apiClient.get<MovieDetails>(`/movies/${id}`);
    return response.data;
  },

  /**
   * Fetch movies by genre
   * Used for genre sections on homepage
   */
  getMoviesByGenre: async (genreId: string): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>(`/movies?genreId=${genreId}`);
    return response.data;
  },

  /**
   * Search movies by title, actor, or director
   * Search is performed on the backend
   */
  searchMovies: async (params: SearchParams): Promise<Movie[]> => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('q', params.query);
    if (params.type) queryParams.append('type', params.type);

    const response = await apiClient.get<Movie[]>(`/movies/search?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get related movies by genre
   */
  getRelatedMovies: async (movieId: string): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>(`/movies/${movieId}/related`);
    return response.data;
  },
};

/**
 * Genre API endpoints
 */
export const genreApi = {
  /**
   * Fetch all available genres
   */
  getGenres: async (): Promise<Genre[]> => {
    const response = await apiClient.get<Genre[]>('/genres');
    return response.data;
  },

  /**
   * Fetch genre by ID
   */
  getGenreById: async (id: string): Promise<Genre> => {
    const response = await apiClient.get<Genre>(`/genres/${id}`);
    return response.data;
  },
};

/**
 * Actor API endpoints
 */
export const actorApi = {
  /**
   * Fetch all actors
   */
  getActors: async (): Promise<Actor[]> => {
    const response = await apiClient.get<Actor[]>('/actors');
    return response.data;
  },

  /**
   * Fetch actor by ID with their movies
   */
  getActorById: async (id: string): Promise<Actor & { movies: Movie[] }> => {
    const response = await apiClient.get<Actor & { movies: Movie[] }>(`/actors/${id}`);
    return response.data;
  },

  /**
   * Get movies by actor
   */
  getMoviesByActor: async (actorId: string): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>(`/movies?actorId=${actorId}`);
    return response.data;
  },
};

/**
 * Director API endpoints
 */
export const directorApi = {
  /**
   * Fetch all directors
   */
  getDirectors: async (): Promise<Director[]> => {
    const response = await apiClient.get<Director[]>('/directors');
    return response.data;
  },

  /**
   * Fetch director by ID with their movies
   */
  getDirectorById: async (id: string): Promise<Director & { movies: Movie[] }> => {
    const response = await apiClient.get<Director & { movies: Movie[] }>(`/directors/${id}`);
    return response.data;
  },

  /**
   * Get movies by director
   */
  getMoviesByDirector: async (directorId: string): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>(`/movies?directorId=${directorId}`);
    return response.data;
  },
};

export default apiClient;
