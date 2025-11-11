import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { 
  GET_CUSTOMER_DETAILS, 
  GET_CUSTOMER_ORDERS, 
  GET_CUSTOMER_ADDRESS 
} from '../services/queries';
import { RootState } from '../models/types';
import { logout } from './slices/authSlice';
import { User, Settings, Package, MapPin, LogOut, ChevronRight } from 'lucide-react-native';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Fetch customer data if authenticated
  const { data: customerData } = useQuery(GET_CUSTOMER_DETAILS, {
    skip: !isAuthenticated,
  });
  const { data: ordersData } = useQuery(GET_CUSTOMER_ORDERS, {
    skip: !isAuthenticated,
  });
  const { data: addressData } = useQuery(GET_CUSTOMER_ADDRESS, {
    skip: !isAuthenticated,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/LoginSignup');
          },
        },
      ]
    );
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>👤</Text>
          <Text style={styles.emptyTitle}>Please Login</Text>
          <Text style={styles.emptySubtitle}>Login to view your profile and orders</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/LoginSignup')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const customer = customerData?.customer || user;
  const orders = ordersData?.customerOrders?.items || [];
  const addresses = addressData?.customerAddress || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer?.name?.charAt(0)?.toUpperCase() || customer?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {customer?.name || 'User'}
              </Text>
              <Text style={styles.userEmail}>{customer?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>My Orders</Text>
          </View>
          {orders.length > 0 ? (
            orders.slice(0, 5).map((order: any, index: number) => (
              <TouchableOpacity key={index} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    Order #{order?.order?.id || order?.id || `#${index + 1}`}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    {order?.order?.items?.length || 0} items
                  </Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          )}
        </View>

        {/* Addresses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
          </View>
          {addresses.length > 0 ? (
            addresses.map((address: any, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    Address {index + 1}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    {address?.address?.street || 'No address details'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No saved addresses</Text>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>Privacy</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: 60,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptySection: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

