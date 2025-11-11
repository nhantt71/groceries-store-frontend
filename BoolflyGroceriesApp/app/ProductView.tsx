import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Star, Plus, Minus } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { Product } from '../models/types';
import { JSX } from 'react/jsx-runtime';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation } from '@apollo/client';
import { ADD_SIMPLE_PRODUCT_TO_CART, ADD_PRODUCT_TO_WISHLIST } from '../services/queries';

export default function ProductViewPage(): JSX.Element {
  const params = useLocalSearchParams<{ productId?: string }>();
  const [selectedQuantity, setSelectedQuantity] = useState<string>('500 grams');
  const [itemCount, setItemCount] = useState<number>(1);
  const [strengthLevel, setStrengthLevel] = useState<number>(2);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const router = useRouter();

  // Mutations
  const [addToCart] = useMutation(ADD_SIMPLE_PRODUCT_TO_CART);
  const [addToWishlist] = useMutation(ADD_PRODUCT_TO_WISHLIST);

  const product: Product = {
    id: parseInt(params.productId || '1'),
    name: 'Potato',
    image: '🥔',
    rating: 3.5,
    likes: 250,
    inStock: true,
    price: 15.0,
    quantityOptions: [
      { label: '1 per kg', multiplier: 1.0 },
      { label: '500 grams', multiplier: 0.5 },
      { label: '2 per kg', multiplier: 2.0 },
    ],
    unit: 'kg',
    color: 'brown',
    category: 'Vegetables',
    description: 'Fresh and organic potatoes.',
  };

  const getQuantityMultiplier = (): number => {
    const option = product.quantityOptions.find((q) => q.label === selectedQuantity);
    return option ? option.multiplier : 1;
  };

  const totalPrice = (product.price * getQuantityMultiplier() * itemCount).toFixed(2);

  const handleAddToCart = async (): Promise<void> => {
    try {
      await addToCart({
        variables: {
          productId: product.id.toString(),
          quantity: itemCount,
        },
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleAddToWishlist = async (): Promise<void> => {
    try {
      await addToWishlist({
        variables: {
          productId: product.id.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} color="#facc15" size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <View key={i} style={{ width: 8, overflow: 'hidden' }}>
            <Star color="#facc15" size={16} />
          </View>
        );
      } else {
        stars.push(<Star key={i} color="#d1d5db" size={16} />);
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{product.name}</Text>
          {product.inStock && <Text style={styles.inStock}>• In Stock</Text>}
        </View>
      </View>

      <View style={styles.imageWrap}>
        <View style={styles.imageCard}>
          <Text style={styles.emoji}>{product.image}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.starsRow}>{renderStars()}</View>
        <Text style={styles.likesText}>{product.likes} Likes</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityRow}>
          {product.quantityOptions.map((option) => {
            const active = selectedQuantity === option.label;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => setSelectedQuantity(option.label)}
                style={[styles.qtyBtn, active ? styles.qtyBtnActive : styles.qtyBtnInactive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.qtyBtnText, active ? styles.qtyBtnTextActive : undefined]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Count</Text>
        <View style={styles.countRow}>
          <TouchableOpacity
            onPress={() => setItemCount(Math.max(1, itemCount - 1))}
            style={[styles.countBtn, itemCount <= 1 && styles.countBtnDisabled]}
            disabled={itemCount <= 1}
            activeOpacity={0.8}
          >
            <Minus color="#4b5563" size={18} />
          </TouchableOpacity>

          <View style={styles.countValueWrap}>
            <Text style={styles.countValue}>{itemCount}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setItemCount(itemCount + 1)}
            style={[styles.countBtn, styles.countBtnPrimary]}
            activeOpacity={0.8}
          >
            <Plus color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Strength Level</Text>
          <Text style={styles.smallText}>{strengthLevel}/5</Text>
        </View>

        <Slider
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={strengthLevel}
          onValueChange={(value) => setStrengthLevel(value)}
          minimumTrackTintColor="#22c55e"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#22c55e"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${totalPrice}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.cta, addedToCart ? styles.ctaActive : styles.ctaNormal]}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>{addedToCart ? '✓ Added to cart' : 'Add to cart'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    backgroundColor: '#16a34a',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 34,
    position: 'relative',
    zIndex: 2,
  },
  headerBack: { marginBottom: 8, padding: 6 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  inStock: { color: '#fff', opacity: 0.9, fontSize: 12 },

  imageWrap: { marginTop: -32, paddingHorizontal: 16, marginBottom: 8, zIndex: 1 },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    elevation: 4,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 72 },

  section: { paddingHorizontal: 16, marginBottom: 12 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 6 },
  likesText: { textAlign: 'center', color: '#16a34a', fontWeight: '600', fontSize: 13 },

  sectionTitle: { color: '#1f2937', fontWeight: '600', fontSize: 14, marginBottom: 8 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  qtyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  qtyBtnActive: { backgroundColor: '#16a34a' },
  qtyBtnInactive: { backgroundColor: '#f3f4f6' },
  qtyBtnText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  qtyBtnTextActive: { color: '#fff' },

  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  countBtnDisabled: { opacity: 0.6 },
  countBtnPrimary: { backgroundColor: '#16a34a' },
  countValueWrap: { flex: 1, alignItems: 'center' },
  countValue: { fontSize: 24, fontWeight: '700', color: '#111827' },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  smallText: { color: '#16a34a', fontWeight: '600' },

  totalRow: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#4b5563', fontSize: 14, fontWeight: '600' },
  totalValue: { color: '#16a34a', fontSize: 20, fontWeight: '800' },

  footer: { paddingHorizontal: 16, paddingBottom: 18 },
  cta: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaNormal: { backgroundColor: '#16a34a' },
  ctaActive: { backgroundColor: '#15803d', transform: [{ scale: 0.98 }] },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});


