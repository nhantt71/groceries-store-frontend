import { configureStore } from '@reduxjs/toolkit';
import authReducer from './app/slices/authSlice';
import cartReducer from './app/slices/cartSlice';
import productReducer from './app/slices/productSlice';
import searchReducer from './app/slices/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

