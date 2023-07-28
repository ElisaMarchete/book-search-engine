const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    _id: ID!
    authors: String
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    users: [User]
    books: [Book]
    user(id: ID!): User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
