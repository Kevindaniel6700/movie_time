/**
 * Theme Slice
 * Manages light/dark theme with localStorage persistence
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
  current: Theme;
}

// Load theme from localStorage
const loadTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('movieflix-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Default to dark for Netflix-style
    return 'dark';
  } catch {
    return 'dark';
  }
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('movieflix-theme', theme);
};

const initialState: ThemeState = {
  current: loadTheme(),
};

// Apply initial theme
applyTheme(initialState.current);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.current = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.current === 'dark' ? 'light' : 'dark';
      state.current = newTheme;
      applyTheme(newTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
