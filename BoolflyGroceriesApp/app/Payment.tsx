import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PAYMENT_METHODS, SET_PAYMENT_METHOD, SET_SHIPPING_METHOD, SET_SHIPPING_ADDRESS, SET_BILLING_ADDRESS } from "../services/queries";

interface PaymentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function Payment({ onNext, onBack }: PaymentStepProps) {
  const [method, setMethod] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");

  // Fetch payment methods
  const { data: paymentMethodsData } = useQuery(GET_PAYMENT_METHODS);

  // Mutations
  const [setPaymentMethod] = useMutation(SET_PAYMENT_METHOD);
  const [setShippingMethod] = useMutation(SET_SHIPPING_METHOD);
  const [setShippingAddress] = useMutation(SET_SHIPPING_ADDRESS);
  const [setBillingAddress] = useMutation(SET_BILLING_ADDRESS);

  const handleNext = async () => {
    if (method && selectedPaymentId) {
      try {
        await setPaymentMethod({
          variables: { paymentMethod: selectedPaymentId },
        });
        onNext({ method, paymentMethodId: selectedPaymentId });
      } catch (error) {
        console.error("Failed to set payment method:", error);
        alert("Failed to set payment method. Please try again.");
      }
    } else {
      alert("Please select a payment method");
    }
  };

  const paymentMethods = paymentMethodsData?.paymentMethods?.items || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <ScrollView>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((pm: any) => (
            <TouchableOpacity
              key={pm.id}
              style={[
                styles.option,
                selectedPaymentId === pm.id && styles.optionSelected,
              ]}
              onPress={() => {
                setMethod(pm.name.toLowerCase().includes("card") ? "card" : "cash");
                setSelectedPaymentId(pm.id);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPaymentId === pm.id && styles.optionTextSelected,
                ]}
              >
                {pm.name.toLowerCase().includes("card") ? "💳" : "💵"} {pm.name}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.option,
                method === "card" && styles.optionSelected,
              ]}
              onPress={() => {
                setMethod("card");
                setSelectedPaymentId("card");
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  method === "card" && styles.optionTextSelected,
                ]}
              >
                💳 Credit / Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                method === "cash" && styles.optionSelected,
              ]}
              onPress={() => {
                setMethod("cash");
                setSelectedPaymentId("cash");
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  method === "cash" && styles.optionTextSelected,
                ]}
              >
                💵 Cash on Delivery
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#16A34A", marginBottom: 30, textAlign: "center" },
  option: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  optionSelected: { borderColor: "#16A34A", backgroundColor: "#ECFDF5" },
  optionText: { fontSize: 16, color: "#374151", fontWeight: "500" },
  optionTextSelected: { color: "#16A34A", fontWeight: "700" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  backButton: { flex: 1, marginRight: 8, backgroundColor: "#E5E7EB", borderRadius: 10, alignItems: "center", paddingVertical: 14 },
  nextButton: { flex: 1, marginLeft: 8, backgroundColor: "#16A34A", borderRadius: 10, alignItems: "center", paddingVertical: 14 },
  backText: { color: "#374151", fontWeight: "600" },
  nextText: { color: "white", fontWeight: "600" },
});


