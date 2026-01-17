/**
 * Unit tests for UI components
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from '@/store/slices/watchlistSlice';
import themeReducer from '@/store/slices/themeSlice';
import uiReducer from '@/store/slices/uiSlice';

// Mock store for testing
const createTestStore = () =>
  configureStore({
    reducer: {
      watchlist: watchlistReducer,
      theme: themeReducer,
      ui: uiReducer,
    },
  });

describe('Component Tests', () => {
  it('should have proper theme slice', () => {
    const store = createTestStore();
    const state = store.getState();
    expect(state.theme).toBeDefined();
    expect(['light', 'dark']).toContain(state.theme.current);
  });

  it('should have proper watchlist slice', () => {
    const store = createTestStore();
    const state = store.getState();
    expect(state.watchlist).toBeDefined();
    expect(Array.isArray(state.watchlist.movies)).toBe(true);
  });

  it('should have proper UI slice', () => {
    const store = createTestStore();
    const state = store.getState();
    expect(state.ui).toBeDefined();
    expect(typeof state.ui.mobileMenuOpen).toBe('boolean');
  });
});

describe('EmptyState Component', () => {
  it('should be defined', async () => {
    const EmptyState = await import('@/components/EmptyState');
    expect(EmptyState.default).toBeDefined();
  });
});

describe('MovieCard Component', () => {
  it('should be defined', async () => {
    const MovieCard = await import('@/components/MovieCard');
    expect(MovieCard.default).toBeDefined();
  });
});

describe('Skeleton Components', () => {
  it('should export skeleton components', async () => {
    const Skeleton = await import('@/components/Skeleton');
    expect(Skeleton.SkeletonCard).toBeDefined();
    expect(Skeleton.SkeletonRow).toBeDefined();
    expect(Skeleton.SkeletonDetails).toBeDefined();
  });
});
