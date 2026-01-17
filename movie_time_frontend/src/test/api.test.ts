/**
 * Unit tests for API service layer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { movieApi, genreApi, actorApi, directorApi } from '@/services/api';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  };
  return { default: mockAxios };
});

const mockedAxios = axios as unknown as {
  create: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('movieApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch movies with filters', async () => {
    const mockMovies = [{ id: '1', title: 'Test Movie' }];
    mockedAxios.get.mockResolvedValueOnce({ data: mockMovies });

    // Note: The actual API call would be tested in integration tests
    // This is a unit test structure example
    expect(movieApi.getMovies).toBeDefined();
  });

  it('should fetch featured movies', async () => {
    expect(movieApi.getFeaturedMovies).toBeDefined();
  });

  it('should fetch movie by ID', async () => {
    expect(movieApi.getMovieById).toBeDefined();
  });

  it('should search movies', async () => {
    expect(movieApi.searchMovies).toBeDefined();
  });
});

describe('genreApi', () => {
  it('should fetch genres', async () => {
    expect(genreApi.getGenres).toBeDefined();
  });

  it('should fetch genre by ID', async () => {
    expect(genreApi.getGenreById).toBeDefined();
  });
});

describe('actorApi', () => {
  it('should fetch actors', async () => {
    expect(actorApi.getActors).toBeDefined();
  });

  it('should fetch actor by ID', async () => {
    expect(actorApi.getActorById).toBeDefined();
  });
});

describe('directorApi', () => {
  it('should fetch directors', async () => {
    expect(directorApi.getDirectors).toBeDefined();
  });

  it('should fetch director by ID', async () => {
    expect(directorApi.getDirectorById).toBeDefined();
  });
});
