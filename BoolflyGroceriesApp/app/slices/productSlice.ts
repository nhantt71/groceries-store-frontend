import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductState, Product } from '../../models/types';

const initialState: ProductState = {
  products: [],
  categories: ['All', 'Fruits', 'Vegetables', 'Breads', 'Other'],
  activeCategory: 'All',
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setActiveCategory, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;