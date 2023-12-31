import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Create an HTTP link to connect to the GraphQL server -> The link is configured to send requests to the "/graphql" endpoint.
// The "uri" option specifies the URL to which the requests will be sent.
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Get the token from the "localStorage" with the key "id_token".
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  // Modifies the headers of each outgoing HTTP request by adding an "authorization" header with the authentication token to authenticate the user with the GraphQL server.
  // This function is provided to Apollo Client through "setContext" to customize the headers before sending a request to the GraphQL server.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// All pages inside ApolloProvider can use client to make queries "localhost:3001/graphql"
function App() {
  return (
    <ApolloProvider client={client}>
      {/* Router, Routes and Route follow the documentation from react-router-dom */}
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
