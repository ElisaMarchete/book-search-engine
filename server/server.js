const express = require("express");
// apllo server express is a middleware that helps apollo server integrate with express
const { ApolloServer } = require("apollo-server-express");
// path is a node module that provides utilities for working with file and directory paths
const path = require("path");
// authMiddleware is a custom middleware function jsonwebtoken get token saved in local storage and send it to the backend
const { authMiddleware } = require("./utils/auth");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

// import connection to mongoDB
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in our schema data (typeDefs and resolvers) and context auth function for every request
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer();
