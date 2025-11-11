import { useRouter } from 'expo-router';
import { ChevronRight, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Offer, Product, RootState } from '../models/types';
import {
  setSearchQuery,
  setSuggestions,
  setShowSuggestions,
  setLoading as setSearchLoading,
} from './slices/searchSlice';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_CATEGORIES, SEARCH_PRODUCTS_SUGGESTIONS_AUTOCOMPLETE } from '../services/queries';
import { setProducts, setActiveCategory } from './slices/productSlice';

// Mock offers (can be replaced with API later)
const mockOffers: Offer[] = [
  { id: 1, name: 'Bread just $9', desc: 'Fresh & Healthy', image: '🍞', color: '#FFFBEB' },
  { id: 2, name: 'Big Onion', desc: 'Premium Quality', image: '🧅', color: '#E9D5FF' },
  { id: 3, name: 'Lemon just $3', desc: 'Fresh Citrus', image: '🍋', color: '#FEF9C3' },
];

export default function MainScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeCategoryLocal, setActiveCategoryLocal] = useState<string>('Fruits');
  const [searchQuery, setSearchQueryLocal] = useState<string>('');

  // Fetch all products
  const { data: productsData, loading: productsLoading } = useQuery(GET_ALL_PRODUCTS);
  
  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Fetch search suggestions
  const { data: suggestionsData } = useQuery(SEARCH_PRODUCTS_SUGGESTIONS_AUTOCOMPLETE, {
    variables: { searchQuery: searchQuery },
    skip: searchQuery.length < 2,
  });

  // Transform and store products
  useEffect(() => {
    if (productsData?.products?.items) {
      const transformedProducts: Product[] = productsData.products.items.map((item: any, index: number) => ({
        id: parseInt(item.id) || index + 1,
        name: item.name || 'Unknown Product',
        price: parseFloat(item.price_range?.minimum_price?.regular_price?.value || '0'),
        unit: '1 kg',
        image: '🛒',
        color: ['#E9D5FF', '#FECACA', '#FEF08A', '#FEE2E2', '#FED7AA', '#BBF7D0', '#DCFCE7'][index % 7],
        category: 'General',
        rating: 4.0,
        likes: 0,
        inStock: true,
      }));
      dispatch(setProducts(transformedProducts));
    }
  }, [productsData, dispatch]);

  // Store categories
  useEffect(() => {
    if (categoriesData?.categories?.items) {
      const categoryNames = categoriesData.categories.items.map((cat: any) => cat.name);
      if (categoryNames.length > 0 && !activeCategoryLocal) {
        setActiveCategoryLocal(categoryNames[0]);
        dispatch(setActiveCategory(categoryNames[0]));
      }
    }
  }, [categoriesData, dispatch, activeCategoryLocal]);

  // Handle search suggestions
  useEffect(() => {
    if (suggestionsData?.searchProductsSuggestions?.items) {
      const suggestions: Product[] = suggestionsData.searchProductsSuggestions.items.map((item: any, index: number) => ({
        id: parseInt(item.id) || index + 1,
        name: item.name || 'Unknown Product',
        price: parseFloat(item.price_range?.minimum_price?.regular_price?.value || '0'),
        unit: '1 kg',
        image: '🛒',
        color: ['#E9D5FF', '#FECACA', '#FEF08A'][index % 3],
        category: 'General',
        rating: 4.0,
        likes: 0,
        inStock: true,
      }));
      dispatch(setSuggestions(suggestions));
      dispatch(setShowSuggestions(true));
    } else if (searchQuery.length === 0) {
      dispatch(setShowSuggestions(false));
    }
  }, [suggestionsData, searchQuery, dispatch]);

  const products = useSelector((state: RootState) => state.product.products);
  const categories = useSelector((state: RootState) => state.product.categories);
  const suggestions = useSelector((state: RootState) => state.search.suggestions);
  const showSuggestions = useSelector((state: RootState) => state.search.showSuggestions);

  const handleSearch = (): void => {
    if (searchQuery.trim()) {
      // Save search to Redux
      dispatch(setSearchQuery(searchQuery));

      // Navigate to search results
      router.push({ pathname: '/SearchResults', params: { query: searchQuery } });

      // Clear local search
      setSearchQueryLocal('');
      dispatch(setShowSuggestions(false));
    }
  };

  const handleSuggestionPress = (product: Product): void => {
    // Navigate to search results with the product name
    dispatch(setSearchQuery(product.name));
    router.push({ pathname: '/SearchResults', params: { query: product.name } });
    setSearchQueryLocal('');
    dispatch(setShowSuggestions(false));
  };

  const handleProductPress = (product: Product): void => {
    router.push({ pathname: '/ProductView', params: { productId: product.id.toString() } });
  };

  const handleCategoryChange = (category: string): void => {
    setActiveCategoryLocal(category);
    dispatch(setActiveCategory(category));
  };

  // Filter products by active category (if category exists in product data)
  const currentProducts: Product[] = products.filter((p) => 
    !activeCategoryLocal || p.category === activeCategoryLocal || activeCategoryLocal === 'All'
  ).slice(0, 8);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Find and order your fresh fruits & vegetables</Text>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search color="#9CA3AF" size={18} />
            <TextInput
              style={styles.input}
              placeholder="Search fresh fruits & vegetables..."
              value={searchQuery}
              onChangeText={setSearchQueryLocal}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQueryLocal('')}>
                <X color="#9CA3AF" size={18} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.slice(0, 5).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(product)}
                >
                  <Text style={styles.suggestionEmoji}>{product.image}</Text>
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionName}>{product.name}</Text>
                    <Text style={styles.suggestionDetail}>
                      ${product.price} • {product.unit}
                    </Text>
                  </View>
                  <Search color="#9CA3AF" size={16} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.length > 0 ? categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryChange(category)}
              style={[
                styles.categoryButton,
                activeCategoryLocal === category && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategoryLocal === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          )) : (
            // Fallback to default categories if API hasn't loaded
            ['Fruits', 'Vegetables', 'Breads', 'Other'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryChange(category)}
                style={[
                  styles.categoryButton,
                  activeCategoryLocal === category && styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategoryLocal === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Products */}
        <View style={styles.productGrid}>
          {currentProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: product.color }]}
              onPress={() => handleProductPress(product)}
            >
              <Text style={styles.productEmoji}>{product.image}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>$ {product.price}</Text>
              <Text style={styles.productUnit}>{product.unit}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.seeAll}
          onPress={() => router.push({ pathname: '/Category', params: { category: activeCategoryLocal } })}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight color="#374151" size={16} />
        </TouchableOpacity>

        {/* Offers */}
        <Text style={styles.offerTitle}>Today's Offers</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersContainer}
        >
          {mockOffers.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[styles.offerCard, { backgroundColor: offer.color }]}
            >
              <Text style={styles.offerEmoji}>{offer.image}</Text>
              <Text style={styles.offerName}>{offer.name}</Text>
              <Text style={styles.offerDesc}>{offer.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⭐</Text>
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/ShoppingCart')}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/Profile' as any })}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#22C55E',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: '#111827',
  },
  suggestions: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
  },
  suggestionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  suggestionDetail: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  categoryScrollContent: {
    paddingRight: 16,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  productCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  productEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  productName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  productUnit: {
    color: '#6B7280',
    fontSize: 12,
  },
  seeAll: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  seeAllText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  offerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  offersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  offerCard: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
  },
  offerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  offerName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#111827',
    marginBottom: 4,
  },
  offerDesc: {
    fontSize: 11,
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    alignItems: 'center',
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  navTextActive: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
    marginTop: 4,
  },
});


