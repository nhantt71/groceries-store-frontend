# Boolfly Groceries – Frontend (Expo + React Native)

An Expo + React Native mobile frontend for a Magento 2 groceries store. It integrates with Magento via GraphQL and implements product browsing, search, cart, authentication, checkout, wishlist, and order flows.


## Features
- Product listing, categories, search suggestions
- Product detail with add-to-cart and wishlist
- Cart management (create cart, update quantities, remove items)
- Authentication (signup, login, forgot password)
- Checkout (shipping address, shipping method, payment method)
- Place order and view basic order info
- Wishlist (add/remove, list)
- Profile page (customer info, orders, addresses)
- Typed routes via Expo Router
- State management via Redux Toolkit
- GraphQL integration via Apollo Client


## Screenshots

###Home Page
<img width="175" height="382" alt="image" src="https://github.com/user-attachments/assets/0909b0a3-1e53-4faa-88b4-c5a7e85cc3cb" />

###Product Page
<img width="181" height="386" alt="image" src="https://github.com/user-attachments/assets/455a2aad-68ba-48f5-b369-d2a895fda221" />

###Shopping Cart Page
<img width="186" height="363" alt="image" src="https://github.com/user-attachments/assets/26434327-ea38-43b9-ba8e-ee4ee843eed4" />


## Tech Stack
- React Native (Expo)
- Expo Router
- TypeScript
- Redux Toolkit
- Apollo Client (GraphQL)


## Requirements
- Node.js 18+ and npm
- Expo CLI (installed automatically via npm scripts)
- A reachable Magento 2 GraphQL endpoint (this project points at a proxy by default)


## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run start
   # or
   npm run android
   # or
   npm run ios
   # or
   npm run web
   ```


## Project Structure
Top-level:
- `BoolflyGroceriesApp/` – the Expo app source
  - `app/` – screens and router entries
    - `_layout.tsx` – app provider tree and route stack
    - `index.tsx` – Home
    - `ProductView.tsx` – Product details
    - `ShoppingCart.tsx` – Cart
    - `Category.tsx` – Category listing
    - `SearchResults.tsx` – Search results
    - `LoginSignup.tsx` – Auth (landing, login, signup)
    - `Profile.tsx` – Profile (info, addresses, orders, logout)
    - `Payment.tsx`, `Checkout.tsx`, `OrderSummary.tsx` – checkout flow
    - `slices/` – Redux slices
  - `services/` – `graphqlClient.ts`, `queries.ts`
  - `context/` – e.g., `ShoppingCartContext.tsx`
  - `models/` – shared types
  - `assets/` – app icons and images


## Magento 2 / GraphQL
- Apollo client is configured in `BoolflyGroceriesApp/services/graphqlClient.ts`.
- Default endpoint (proxy):
  ```
  https://magentoappproxy.test:4000/graphql
  ```
  Update this to point to your environment if needed.

- Common operations are defined in `BoolflyGroceriesApp/services/queries.ts`:
  - Products, categories, search
  - Cart: create cart, add/update/remove items, get cart
  - Auth: create customer, generate/revoke token, forgot password, customer details
  - Checkout: addresses, shipping methods, payment methods, place order
  - Wishlist: add/remove/list


## Environment Notes
- Safe areas: critical screens use `react-native-safe-area-context` to avoid status bar/camera cutouts.
- Expo Router typed routes: If you add new screens, restart the dev server to regenerate route types. Until then, you may temporarily need a type assertion when navigating to new screens.
- Apollo warning: Apollo Client 3.14 can show a deprecation warning from internals. Functionality is unaffected. Upgrading to the latest `@apollo/client` can remove the warning.


## Useful Scripts
- `npm run start` – start Expo dev server
- `npm run android` / `npm run ios` / `npm run web` – start on target platform
- `npm run reset-project` – clean Expo cache and reset (see `scripts/reset-project.js`)
- `npm run lint` – run ESLint (Expo config)


## Troubleshooting
- Navigation type error to a new route:
  - Restart Expo server to regenerate route typings, or temporarily use `router.push({ pathname: '/NewScreen' as any })`.
- Status bar / camera cutout overlapping:
  - Ensure screens are wrapped with `SafeAreaView` and proper top padding.
- GraphQL connectivity:
  - Verify the endpoint in `services/graphqlClient.ts`.
  - If using a local proxy with HTTPS, ensure certificates are trusted on the device/emulator.


## License
MIT © 2025 Boolfly Groceries
