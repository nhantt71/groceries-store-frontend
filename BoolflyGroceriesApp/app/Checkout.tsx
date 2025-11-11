import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_CUSTOMER_ADDRESS, GET_SHIPPING_METHODS } from "../services/queries";

export default function Checkout({ onNext }: { onNext: (data: any) => void }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const { cartItems, getTotalPrice } = useShoppingCart();

  // Fetch shipping methods
  const { data: shippingMethodsData } = useQuery(GET_SHIPPING_METHODS);
  const [createAddress] = useMutation(CREATE_CUSTOMER_ADDRESS);

  const handleNext = async () => {
    if (form.name && form.address && form.phone) {
      try {
        // Create customer address
        await createAddress({
          variables: {
            address: JSON.stringify({
              name: form.name,
              address: form.address,
              phone: form.phone,
            }),
          },
        });

        const checkoutData = {
          ...form,
          cart: cartItems,
          total: getTotalPrice(),
          shippingMethods: shippingMethodsData?.shippingMethods?.items || [],
        };
        onNext(checkoutData);
      } catch (error) {
        console.error("Failed to create address:", error);
        alert("Failed to save address. Please try again.");
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.title}>Shipping Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="Enter your full name" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Enter your address" value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#16A34A", marginBottom: 30, textAlign: "center" },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: "#374151", marginBottom: 6 },
  input: { backgroundColor: "white", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 16 },
  button: { backgroundColor: "#16A34A", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});


