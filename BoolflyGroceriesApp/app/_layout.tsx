import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "../hooks/use-color-scheme";
import { ShoppingCartProvider } from "../context/ShoppingCartContext";
import { Provider } from "react-redux";
import { store } from "../store";
import { ApolloProvider } from "@apollo/client";
import client from "../services/graphqlClient";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
    <Provider store={store}>
      <ShoppingCartProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="ShoppingCart" />
            <Stack.Screen name="ProductView" />
            <Stack.Screen name="SearchResults" />
            <Stack.Screen name="Profile" />
            <Stack.Screen name="LoginSignup" />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ShoppingCartProvider>
    </Provider>
    </ApolloProvider>
  );
}
