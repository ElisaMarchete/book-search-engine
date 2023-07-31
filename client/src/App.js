import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  // proxy from package json to localhost:3001/graphql
  uri: "/graphql",
  cache: new InMemoryCache(),
});

// All pages inside ApolloProvider can use client to make queries "localhost:3001/graphql"
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
