import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, Product } from '../../models/types';

const initialState: SearchState = {
  searchQuery: '',
  searchResults: [],
  suggestions: [],
  showSuggestions: false,
  loading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Product[]>) => {
      state.suggestions = action.payload;
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
      state.suggestions = [];
      state.showSuggestions = false;
      state.loading = false;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setSuggestions,
  setShowSuggestions,
  setLoading,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;