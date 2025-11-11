import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create cache without deprecated options
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://magentoappproxy.test:4000/graphql',
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
