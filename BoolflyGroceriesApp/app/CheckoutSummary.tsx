import React, { useContext } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { ShoppingCartContext } from "../context/ShoppingCartContext";

export default function CheckoutSummaryScreen() {
  const context = useContext(ShoppingCartContext);

  if (!context) {
    throw new Error("ShoppingCartContext must be used within a ShoppingCartProvider");
  }

  const { cartItems, totalPrice } = context;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.qty}>Quantity: {item.quantity}</Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString("en-US")} USD
                </Text>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>
          {totalPrice.toLocaleString("en-US")} USD
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 30 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  qty: { color: "#555", marginTop: 4 },
  price: { color: "#000", fontWeight: "bold", marginTop: 4 },
  totalBox: { borderTopWidth: 1, borderColor: "#ddd", marginTop: 20, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#e91e63" },
});


