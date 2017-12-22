import fetch from 'isomorphic-fetch';

import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';

function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables
) {
  //return fetch('/graphql', {
  //  method: 'POST',
  //  headers: {
  //    'Accept': 'application/json',
  //    'Content-Type': 'application/graphql',
  //  },
  //  body: operation.text
  //})
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: operation.text, variables }),
  }).then(response => {
    return response.json();
  });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);

export default new Environment({
  network,
  store
});
