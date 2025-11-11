export interface QuantityOption {
  label: string;
  multiplier: number;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  likes: number;
  inStock: boolean;
  price: number;
  quantityOptions: { label: string; multiplier: number }[];
  brand?: string;
  stock?: number;
  unit?: string;
  color?: string;
  category?: string;
  description?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  color: string;
}


export interface Offer {
  id: number;
  name: string;
  desc: string;
  image: string;
  color: string;
}


export interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface Offer {
  id: number;
  name: string;
  desc: string;
  image: string;
  color: string;
}

export interface SearchState {
  searchQuery: string;
  searchResults: Product[];
  suggestions: Product[];
  showSuggestions: boolean;
  loading: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface RootState {
  auth: AuthState;
  cart: CartState;
  product: ProductState;
  search: SearchState;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  activeCategory: string;
  loading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  MainNav: undefined;
  AuthNav: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  SearchResults: { query: string };
  Category: { category: string };
  ProductView: { product: Product };
  Cart: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
};