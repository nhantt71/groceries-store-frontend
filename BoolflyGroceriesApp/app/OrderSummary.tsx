import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { CartItem } from "../models/types";
import { useMutation, useQuery } from "@apollo/client";
import { PLACE_ORDER, GET_ORDER_DETAILS } from "../services/queries";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";


interface SummaryStepProps {
    cartItems: CartItem[];
    shipping: { name: string; address: string; phone: string };
    payment: { method: string };
    onBack: () => void;
    onPlaceOrder: () => void;
}

export default function OrderSummary({
    cartItems,
    shipping,
    payment,
    onBack,
    onPlaceOrder,
}: SummaryStepProps) {
    const router = useRouter();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [placeOrder] = useMutation(PLACE_ORDER);
    const { data: orderData } = useQuery(GET_ORDER_DETAILS, {
        variables: { orderId },
        skip: !orderId,
    });

    const total = (cartItems ?? [])
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    const handlePlaceOrder = async (): Promise<void> => {
        setPlacingOrder(true);
        try {
            const { data } = await placeOrder();
            const newOrderId = data?.placeOrder?.order?.id;
            if (newOrderId) {
                setOrderId(newOrderId);
                onPlaceOrder();
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to place order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Summary</Text>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Shipping Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping Information</Text>
                    <Text style={styles.text}>{shipping?.name ?? "No name provided"}</Text>
                    <Text style={styles.text}>{shipping?.address ?? "No address"}</Text>
                    <Text style={styles.text}>{shipping?.phone ?? "No phone"}</Text>
                </View>

                {/* Payment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <Text style={styles.text}>
                        {payment?.method === "card"
                            ? "💳 Credit / Debit Card"
                            : "💵 Cash on Delivery"}
                    </Text>

                </View>

                {/* Cart Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Items</Text>
                    {(cartItems ?? []).map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemImageContainer}>
                                <Text style={styles.itemImage}>{item.image}</Text>
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>
                                    {item.quantity} {item.unit}
                                </Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Total */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${total}</Text>
                </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.placeButton, placingOrder && styles.placeButtonDisabled]}
                    onPress={handlePlaceOrder}
                    disabled={placingOrder}
                >
                    <Text style={styles.placeText}>
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 20,
    },
    scroll: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#16A34A",
        marginBottom: 20,
        textAlign: "center",
    },
    section: {
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
    },
    text: {
        fontSize: 15,
        color: "#4B5563",
    },
    itemCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    itemImageContainer: {
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        padding: 10,
        marginRight: 12,
    },
    itemImage: {
        fontSize: 24,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    itemQuantity: {
        fontSize: 14,
        color: "#6B7280",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#16A34A",
    },
    totalCard: {
        backgroundColor: "#ECFDF5",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    totalLabel: {
        fontSize: 18,
        color: "#065F46",
        fontWeight: "600",
    },
    totalValue: {
        fontSize: 22,
        color: "#16A34A",
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    backButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 14,
    },
    placeButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: "#16A34A",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 14,
    },
    backText: {
        color: "#374151",
        fontWeight: "600",
    },
    placeText: {
        color: "white",
        fontWeight: "600",
    },
    placeButtonDisabled: {
        opacity: 0.6,
    },
});


