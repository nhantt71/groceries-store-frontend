import { useRouter } from "expo-router";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react-native";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JSX } from "react/jsx-runtime";
import { CartItem } from "../models/types";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, CREATE_EMPTY_CART, UPDATE_CART_ITEM, REMOVE_CART_ITEM, ADD_SIMPLE_PRODUCT_TO_CART } from "../services/queries";

export default function ShoppingCartPage(): JSX.Element {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  // Fetch cart
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART, {
    skip: !cartId,
  });

  // Mutations
  const [createEmptyCart] = useMutation(CREATE_EMPTY_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM);

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      if (!cartId) {
        try {
          const { data } = await createEmptyCart();
          const newCartId = data?.createEmptyCart?.cart?.id;
          if (newCartId) {
            setCartId(newCartId);
          }
        } catch (error) {
          console.error("Failed to create cart:", error);
        }
      }
    };
    initCart();
  }, [cartId, createEmptyCart]);

  // Transform cart data
  useEffect(() => {
    if (cartData?.cart?.items) {
      const transformedItems: CartItem[] = cartData.cart.items.map((item: any, index: number) => ({
        id: parseInt(item.id) || index + 1,
        name: item.name || "Unknown Item",
        price: 0, // Price should come from cart data
        quantity: item.quantity || 1,
        unit: "1 kg",
        image: "🛒",
        color: "#E9D5FF",
      }));
      setCartItems(transformedItems);
    }
  }, [cartData]);

  const getTotalItems = (): number => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = (): string => {
    const total = cartData?.cart?.total_price?.value 
      ? parseFloat(cartData.cart.total_price.value)
      : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  const updateQuantity = async (itemId: string, change: number): Promise<void> => {
    const item = cartItems.find((i) => i.id.toString() === itemId);
    if (!item || !cartId) return;

    const newQuantity = Math.max(1, item.quantity + change);
    try {
      await updateCartItem({
        variables: { cartItemId: itemId, quantity: newQuantity },
      });
      refetchCart();
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const removeItem = async (itemId: string): Promise<void> => {
    if (!cartId) return;
    try {
      await removeCartItem({
        variables: { cartItemId: itemId },
      });
      refetchCart();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleContinue = (): void => {
    setShowCheckout(true);
    setTimeout(() => {
      setShowCheckout(false);
      router.push("/Checkout");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <Text style={styles.headerSub}>• A total of {getTotalItems()} pieces</Text>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.scroll}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add some items to get started</Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardRow}>
                {/* Product Image */}
                <View style={[styles.imageWrap, { backgroundColor: item.color }]}>
                  <Text style={styles.imageText}>{item.image}</Text>
                </View>

                {/* Product Info */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.unit}>{item.quantity} {item.unit}</Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id.toString(), 1)}
                    style={[styles.iconBtn, styles.iconAdd]}
                  >
                    <Plus color="white" size={16} />
                  </TouchableOpacity>

                  <Text style={styles.qty}>{item.quantity}</Text>

                  {item.quantity > 1 ? (
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id.toString(), -1)}
                      style={[styles.iconBtn, styles.iconMinus]}
                    >
                      <Minus color="gray" size={16} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => removeItem(item.id.toString())}
                      style={[styles.iconBtn, styles.iconRemove]}
                    >
                      <Trash2 color="red" size={16} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${getTotalPrice()}</Text>
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.cta, showCheckout ? styles.ctaActive : styles.ctaNormal]}
          >
            <Text style={styles.ctaText}>
              {showCheckout ? "✓ Processing..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },

  header: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 60,
  },
  headerRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 6,
    position: "relative",
  },
  backBtn: { 
    marginRight: 12,
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    position: "relative",
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "700",
    flex: 1,
    marginLeft: 4,
  },
  headerSub: { color: "#fff", opacity: 0.9, marginLeft: 36 },

  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  emptyWrap: { alignItems: "center", paddingVertical: 48 },
  emptyEmoji: { fontSize: 64, marginBottom: 8 },
  emptyText: { color: "#4b5563", fontSize: 18, fontWeight: "600" },
  emptySub: { color: "#9ca3af", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  imageWrap: {
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  imageText: { fontSize: 40 },

  info: { flex: 1 },
  name: { color: "#111827", fontSize: 16, fontWeight: "600" },
  price: { color: "#16a34a", fontSize: 18, fontWeight: "700" },
  unit: { color: "#6b7280", fontSize: 13 },

  controls: { alignItems: "center" },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  iconAdd: { backgroundColor: "#16a34a" },
  iconMinus: { backgroundColor: "#e5e7eb" },
  iconRemove: { backgroundColor: "#fee2e2" },
  qty: { color: "#111827", fontWeight: "600", fontSize: 14 },

  footer: { paddingHorizontal: 16, paddingBottom: 20, gap: 14 },
  totalRow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  totalLabel: { color: "#4b5563", fontSize: 16, fontWeight: "600" },
  totalValue: { color: "#16a34a", fontSize: 22, fontWeight: "800" },

  cta: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  ctaNormal: { backgroundColor: "#16a34a" },
  ctaActive: { backgroundColor: "#15803d" },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});


