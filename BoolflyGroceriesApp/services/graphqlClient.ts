import { ApolloClient, InMemoryCache, HttpLink, FetchPolicy } from '@apollo/client';

// Create cache without deprecated options
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://magentoappproxy.test:4000/graphql',
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
    },
    query: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
    },
  },
});

export default client;
