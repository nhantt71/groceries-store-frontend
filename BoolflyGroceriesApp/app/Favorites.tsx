import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WISHLIST, ADD_PRODUCT_TO_WISHLIST, REMOVE_PRODUCT_FROM_WISHLIST } from '../services/queries';
import { Product } from '../models/types';
import { useRouter } from 'expo-router';

export default function Favorites() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Fetch wishlist
  const { data: wishlistData, refetch: refetchWishlist } = useQuery(GET_WISHLIST);

  // Mutations
  const [removeFromWishlist] = useMutation(REMOVE_PRODUCT_FROM_WISHLIST);

  // Transform wishlist data
  useEffect(() => {
    if (wishlistData?.wishlist?.items) {
      const transformedItems: Product[] = wishlistData.wishlist.items.map((item: any, index: number) => ({
        id: parseInt(item.id) || index + 1,
        name: item.name || 'Unknown Product',
        price: 0,
        unit: '1 kg',
        image: '⭐',
        color: ['#FEF9C3', '#FEF3C7', '#FDE68A'][index % 3],
        category: 'General',
        rating: 4.0,
        likes: 0,
        inStock: true,
      }));
      setWishlistItems(transformedItems);
    }
  }, [wishlistData]);

  const handleRemove = async (productId: string): Promise<void> => {
    try {
      await removeFromWishlist({
        variables: { productId },
      });
      refetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleProductPress = (product: Product): void => {
    router.push({ pathname: '/ProductView', params: { productId: product.id.toString() } });
  };

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>You haven't added any favorites yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      <ScrollView style={styles.scroll}>
        {wishlistItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.itemCard, { backgroundColor: item.color }]}
            onPress={() => handleProductPress(item)}
          >
            <Text style={styles.itemEmoji}>{item.image}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemove(item.id.toString())}
              style={styles.removeButton}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '700',
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
});



