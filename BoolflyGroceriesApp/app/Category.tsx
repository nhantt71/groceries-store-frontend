import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { ChevronLeft, Search, SlidersHorizontal, ChevronDown, Plus, Minus, ShoppingCart, X } from "lucide-react-native";
import { Product } from "../models/types";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORY_DETAILS } from "../services/queries";


export default function CategoryPage() {
  const params = useLocalSearchParams<{ category?: string }>();
  const categoryName = params.category || "Vegetables";
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState(5);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showCartNotification, setShowCartNotification] = useState(false);
  const router = useRouter();

  // Fetch category details
  const { data: categoryData } = useQuery(GET_CATEGORY_DETAILS, {
    variables: { categoryId: categoryName },
    skip: !categoryName,
  });

  // Fetch products by category
  const { data: productsData } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { category: categoryName },
    skip: !categoryName,
  });

  const categoryInfo = {
    name: categoryData?.category?.name || categoryName,
    description: categoryData?.category?.description || "Fresh, organic products delivered daily from local farms",
  };

  const brands = ["Fresh Farm", "Organic Plus", "Green Valley"];

  // Transform products from API
  const allProducts: Partial<Product>[] = productsData?.products?.items?.map((item: any, index: number) => ({
    id: parseInt(item.id) || index + 1,
    name: item.name || "Unknown Product",
    category: categoryName,
    price: parseFloat(item.price_range?.minimum_price?.regular_price?.value || '0'),
    unit: "1 kg",
    rating: 4.5,
    brand: brands[index % brands.length],
    stock: 50,
    image: "🛒",
    color: ["#f3e8ff", "#fee2e2", "#fef9c3", "#ffedd5", "#dcfce7"][index % 5],
  })) || [];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const updateCart = (productId: number, change: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const newQty = Math.max(0, current + change);
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const addToCart = (productId: number) => {
    updateCart(productId, 1);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 1500);
  };

  const filteredProducts = allProducts
    .filter((p: any) => p.category === categoryInfo.name)
    .filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p: any) => (selectedBrands.length ? selectedBrands.includes(p.brand) : true))
    .filter((p: any) => p.rating >= minRating)
    .filter((p: any) => (inStockOnly ? p.stock > 0 : true));

  const visibleProducts = filteredProducts.slice(0, displayedProducts);

  const loadMore = () => {
    setDisplayedProducts((prev) =>
      Math.min(prev + 4, filteredProducts.length)
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal color="white" size={22} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{categoryInfo.name}</Text>
        <Text style={styles.headerDesc}>{categoryInfo.description}</Text>

        <View style={styles.searchBox}>
          <Search color="#999" size={18} />
          <TextInput
            placeholder={`Search in ${categoryInfo.name}...`}
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color="#999" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter section */}
      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.filterLabel}>In Stock Only</Text>
          <Switch
            value={inStockOnly}
            onValueChange={setInStockOnly}
            trackColor={{ true: "#16a34a", false: "#ccc" }}
          />

          <Text style={styles.filterLabel}>Brand</Text>
          {brands.map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => toggleBrand(b)}
              style={[
                styles.brandButton,
                selectedBrands.includes(b) && styles.brandButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.brandText,
                  selectedBrands.includes(b) && styles.brandTextActive,
                ]}
              >
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Product Grid */}
      <ScrollView contentContainerStyle={styles.productGrid}>
        {visibleProducts.map((p:any) => (
          <View
            key={p.id}
            style={[styles.productCard, { backgroundColor: p.color }]}
          >
            <Text style={styles.productImage}>{p.image}</Text>
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productPrice}>${p.price}</Text>
            <Text style={styles.productUnit}>{p.unit}</Text>

            {cart[p.id] ? (
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCart(p.id, -1)}
                >
                  <Minus size={16} color="#333" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{cart[p.id]}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyAdd]}
                  onPress={() => updateCart(p.id, 1)}
                >
                  <Plus size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addToCart(p.id)}
              >
                <ShoppingCart size={14} color="#fff" />
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {displayedProducts < filteredProducts.length && (
          <TouchableOpacity style={styles.loadMore} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <ChevronDown size={18} color="#16a34a" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Cart Notification */}
      {showCartNotification && (
        <View style={styles.cartNotif}>
          <ShoppingCart color="white" size={18} />
          <Text style={styles.cartNotifText}>Added to cart!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  headerDesc: { color: "white", opacity: 0.9, fontSize: 13, marginBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#333", fontSize: 14 },
  filters: { backgroundColor: "white", padding: 16 },
  filterLabel: { fontWeight: "600", marginVertical: 8, color: "#333" },
  brandButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    borderRadius: 8,
    marginVertical: 4,
  },
  brandButtonActive: { borderColor: "#16a34a", backgroundColor: "#dcfce7" },
  brandText: { textAlign: "center", color: "#333" },
  brandTextActive: { color: "#16a34a", fontWeight: "600" },
  productGrid: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "47%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  productImage: { fontSize: 42, textAlign: "center" },
  productName: { fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 4 },
  productPrice: { color: "#16a34a", fontWeight: "700", textAlign: "center" },
  productUnit: { color: "#6b7280", fontSize: 12, textAlign: "center" },
  qtyRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 6 },
  qtyBtn: { backgroundColor: "#fff", padding: 6, borderRadius: 20 },
  qtyAdd: { backgroundColor: "#16a34a" },
  qtyText: { marginHorizontal: 10, fontWeight: "600" },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 6,
    gap: 4,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 12 },
  loadMore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#16a34a",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    marginTop: 16,
  },
  loadMoreText: { color: "#16a34a", fontWeight: "600", marginRight: 4 },
  cartNotif: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "#16a34a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartNotifText: { color: "white", fontWeight: "600" },
});


