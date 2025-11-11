import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Product, RootState } from '../models/types';
import { clearSearch, setSearchQuery, setSearchResults, setLoading } from './slices/searchSlice';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_SEARCH } from '../services/queries';

type Params = { query?: string };

export default function SearchResultsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const searchQuery = useSelector((state: RootState) => state.search.searchQuery);
  const searchResults = useSelector((state: RootState) => state.search.searchResults);

  // Get query from params or Redux
  const query = params.query 
    ? (Array.isArray(params.query) ? params.query[0] : params.query)
    : searchQuery;

  // Fetch search results
  const { data: searchData, loading: searchLoading } = useQuery(GET_PRODUCTS_BY_SEARCH, {
    variables: { searchQuery: query },
    skip: !query || query.length < 1,
  });

  // Initialize search from route params if available
  useEffect(() => {
    if (params.query) {
      const q = Array.isArray(params.query) ? params.query[0] : params.query;
      dispatch(setSearchQuery(q));
    }
  }, [params.query, dispatch]);

  // Transform and store search results
  useEffect(() => {
    if (searchData?.products?.items) {
      dispatch(setLoading(false));
      const transformedProducts: Product[] = searchData.products.items.map((item: any, index: number) => ({
        id: parseInt(item.id) || index + 1,
        name: item.name || 'Unknown Product',
        price: parseFloat(item.price_range?.minimum_price?.regular_price?.value || '0'),
        unit: '1 kg',
        image: '🛒',
        color: ['#DCFCE7', '#FEF9C3', '#FFFBEB', '#F0FDF4'][index % 4],
        category: 'General',
        rating: 4.0,
        likes: 0,
        inStock: true,
      }));
      dispatch(setSearchResults(transformedProducts));
    } else if (searchLoading) {
      dispatch(setLoading(true));
    }
  }, [searchData, searchLoading, dispatch]);

  const handleClearSearch = (): void => {
    dispatch(clearSearch());
  };

  const handleBack = (): void => {
    dispatch(clearSearch());
    router.back();
  };

  const handleProductPress = (product: Product): void => {
    router.push({ pathname: '/ProductView', params: { productId: product.id.toString() } });
  };

  const cardColors: string[] = ['#DCFCE7', '#FEF9C3', '#FFFBEB', '#F0FDF4'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Vegetables & Fruits</Text>
            <Text style={styles.headerSubtitle}>• All items currently in store</Text>
          </View>
        </View>
      </View>

      {/* Search Results */}
      <ScrollView style={styles.content}>
        <View style={styles.resultsContainer}>
          {searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
            </View>
          ) : (
            searchResults.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={[styles.resultCard, { backgroundColor: cardColors[index % cardColors.length] }]}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.resultContent}>
                  <Text style={styles.resultEmoji}>{product.image}</Text>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{product.name}</Text>
                    <Text style={styles.resultPrice}>$ {product.price}</Text>
                    <Text style={styles.resultUnit}>{product.unit}</Text>
                  </View>
                </View>
                <View style={styles.arrowButton}>
                  <ChevronRight color="#374151" size={20} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⭐</Text>
          <Text style={styles.navText}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Items</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  resultsContainer: {
    padding: 16,
  },
  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 2,
  },
  resultUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrowButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
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
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});


