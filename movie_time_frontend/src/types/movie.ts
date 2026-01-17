/**
 * Core movie-related type definitions
 * All types match expected backend API responses
 */

export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  rating: number;
  director: Director;
  actors: Actor[];
  genres: Genre[];
  description?: string;
  isFeatured?: boolean;
}

export interface Actor {
  id: string;
  name: string;
  bio?: string;
}

export interface Director {
  id: string;
  name: string;
  bio?: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface MovieDetails extends Movie {
  reviews?: Review[];
  relatedMovies?: Movie[];
}

export interface Review {
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface SearchParams {
  query?: string;
  type?: 'title' | 'actor' | 'director';
}

export interface FilterParams {
  genreId?: string;
  actorId?: string;
  directorId?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
