import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GET_ALL_PRODUCTS {
    products {
      items {
        id
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;


export const GET_PRODUCTS_BY_SEARCH = gql`
  query GET_PRODUCTS_BY_SEARCH($searchQuery: String!) {
    products(search: $searchQuery) {
      items {
        id
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GET_PRODUCTS_BY_CATEGORY($category: String!) {
    products(category: $category) {
      items {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_BRAND = gql`
  query GET_PRODUCTS_BY_BRAND($brand: String!) {
    products(brand: $brand) {
      items {
        id
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;


export const GET_PRODUCTS_BY_PRICE = gql`
  query GET_PRODUCTS_BY_PRICE($price: Float!) {
    products(price: $price) {
      items {
        id
        name
      }
    }
  }
`;


export const GET_PRODUCTS_BY_RATING = gql`
  query GET_PRODUCTS_BY_RATING($rating: Float!) {
    products(rating: $rating) {
      items {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_STOCK = gql`
  query GET_PRODUCTS_BY_STOCK($stock: Int!) {
    products(stock: $stock) {
      items {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      items {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORY_DETAILS = gql`
  query GET_CATEGORY_DETAILS($categoryId: String!) {
    category(id: $categoryId) {
      id
      name
      description
    }
  }
`;

export const CREATE_EMPTY_CART = gql`
  mutation CREATE_EMPTY_CART {
    createEmptyCart {
      cart {
        id
      }
    }
  }
`;

export const ADD_SIMPLE_PRODUCT_TO_CART = gql`
  mutation ADD_SIMPLE_PRODUCT_TO_CART($productId: String!, $quantity: Int!) {
    addSimpleProductToCart(input: { product_id: $productId, quantity: $quantity }) {
      cart {
        id
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UPDATE_CART_ITEM($cartItemId: String!, $quantity: Int!) {
    updateCartItem(input: { cart_item_id: $cartItemId, quantity: $quantity }) {
      cart {
        id
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation REMOVE_CART_ITEM($cartItemId: String!) {
    removeCartItem(input: { cart_item_id: $cartItemId }) {
      cart {
        id
      }
    }
  }
`;

export const GET_CART = gql`
  query GET_CART {
    cart {
      id
      items {
        id
        name
        quantity
      }
      total_quantity
      total_price {
        value
        currency
      }
    }
  }
`;

export const MERGE_CART = gql`
  mutation MERGE_CART($cartId: String!) {
    mergeCart(input: { cart_id: $cartId }) {
      cart {
        id
      }
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GENERATE_CUSTOMER_TOKEN($email: String!, $password: String!) {
    generateCustomerToken(input: { email: $email, password: $password }) {
      token
    }
  }
`; 

export const REVOKE_CUSTOMER_TOKEN = gql`
  mutation REVOKE_CUSTOMER_TOKEN($token: String!) {
    revokeCustomerToken(input: { token: $token }) {
      token
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation FORGOT_PASSWORD($email: String!) {
    forgotPassword(input: { email: $email }) {
      token
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CREATE_CUSTOMER($email: String!, $password: String!) {
    createCustomer(input: { email: $email, password: $password }) {
      customer {
        id
        email
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UPDATE_CUSTOMER($email: String!, $password: String!) {
    updateCustomer(input: { email: $email, password: $password }) {
      customer {
        id
        email
      }
    }
  }
`;

export const GET_CUSTOMER_DETAILS = gql`
  query GET_CUSTOMER_DETAILS {
    customer {
      id
      email
    }
  }
`;

export const GET_CUSTOMER_ADDRESS = gql`
  query GET_CUSTOMER_ADDRESS {
    customerAddress {
      id
      address {
        street
        city
        state
        postal_code
        country
      }
    }
  }
`;

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CREATE_CUSTOMER_ADDRESS($address: String!) {
    createCustomerAddress(input: { address: $address }) {
      customerAddress {
        id
      }
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UPDATE_CUSTOMER_ADDRESS($addressId: String!, $address: String!) {
    updateCustomerAddress(input: { address_id: $addressId, address: $address }) {
      customerAddress {
        id
      }
    }
  }
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DELETE_CUSTOMER_ADDRESS($addressId: String!) {
    deleteCustomerAddress(input: { address_id: $addressId }) {  
      customerAddress {
        id
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = gql`
  mutation SET_SHIPPPING_ADDRESS($addressId: String!) {
    setShippingAddress(input: { address_id: $addressId }) {
      customerAddress {
        id
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = gql`
  mutation SET_SHIPPING_METHOD($shippingMethod: String!) {
    setShippingMethod(input: { shipping_method: $shippingMethod }) {
      shippingMethod {
        id
      }
    }
  }
`;

export const SET_PAYMENT_METHOD = gql`
  mutation SET_PAYMENT_METHOD($paymentMethod: String!) {
    setPaymentMethod(input: { payment_method: $paymentMethod }) {
      paymentMethod {
        id
      }
    }
  }
`;

export const SET_BILLING_ADDRESS = gql`
  mutation SET_BILLING_ADDRESS($addressId: String!) {
    setBillingAddress(input: { address_id: $addressId }) {
      customerAddress {
        id
      }
    }
  }
`;

export const GET_SHIPPING_METHODS = gql`
  query GET_SHIPPING_METHODS {
    shippingMethods {
      items {
        id
        name
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GET_PAYMENT_METHODS {
    paymentMethods {
      items {
        id
        name
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PLACE_ORDER {
    placeOrder {
      order {
        id
      }
    }
  }
`;

export const GET_ORDER_DETAILS = gql`

  query GET_ORDER_DETAILS($orderId: String!) {
    order(id: $orderId) {
      id
      items {
        id
        name
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query GET_CUSTOMER_ORDERS {
    customerOrders {
      items {
        id
        order {
          id
          items {
            id
            name
            quantity
          }
        }
      }
    }
  }
`;  

export const ADD_PRODUCT_TO_WISHLIST = gql`
  mutation ADD_PRODUCT_TO_WISHLIST($productId: String!) {
    addProductToWishlist(input: { product_id: $productId }) {
      wishlist {
        id
      }
    }
  }
`;

export const GET_WISHLIST = gql`
  query GET_WISHLIST {
    wishlist {
      id
      items {
        id
        name
      }
    }
  }
`;

export const REMOVE_PRODUCT_FROM_WISHLIST = gql`
  mutation REMOVE_PRODUCT_FROM_WISHLIST($productId: String!) {
    removeProductFromWishlist(input: { product_id: $productId }) {
      wishlist {
        id
      }
    }
  }
`;

export const GET_STORE_CONFIGURATION = gql`
  query GET_STORE_CONFIGURATION {
    storeConfiguration {
      id
      name
    }
  }
`;

export const GET_CURRENCY_INFORMATION = gql`
  query GET_CURRENCY_INFORMATION {
    currencyInformation {
      id
      name
    }
  }
`;

export const GET_AVAILABLE_STORES = gql`
  query GET_AVAILABLE_STORES {
    availableStores {
      id
      name
    }
  }
`;

export const SEARCH_PRODUCTS_SUGGESTIONS_AUTOCOMPLETE = gql`
  query SEARCH_PRODUCTS_SUGGESTIONS_AUTOCOMPLETE($searchQuery: String!) {
    searchProductsSuggestions(input: { search: $searchQuery }) {
      items {
        id
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency  
            }
          }
        }
      }
    }
  }
`;