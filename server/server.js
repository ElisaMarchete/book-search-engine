const express = require("express");
// const path = require("path");
// const routes = require("./routes");
const { ApolloServer } = require("apollo-server-express");

//Import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New instance of an Apollo server with GtaphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

startApolloServer();
