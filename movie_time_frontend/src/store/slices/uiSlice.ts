/**
 * UI Slice
 * Manages general UI state like loading and modals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  mobileMenuOpen: boolean;
}

const initialState: UiState = {
  globalLoading: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

export const { setGlobalLoading, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
