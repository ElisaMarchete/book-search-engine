const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

// resolvers graphQL = ROUTES in RESTful APIs

const resolvers = {
  // Query is a GET request
  Query: {
    user: async (parent, args, context) => {
      // if context has a `user` property, that means the user executing this query has a valid JWT and is logged in
      if (context.user) {
        // keeping sensitive fields like __v (version number) and password hidden from the client
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        // return userData without the password and __v fields to the client
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  // Mutation is a POST, PUT, or DELETE request
  Mutation: {
    // addUser is a POST request to create a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      // variable token is passing created user's data into the signToken function to create a token
      const token = signToken(user);

      return { token, user };
    },

    // login is a POST request to login an existing user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // pass loged user data into signToken function to create a token
      const token = signToken(user);
      return { token, user };
    },

    // saveBook is a POST request to save a book to a user's `savedBooks`
    // bookData from typeDefs mutation
    saveBook: async (parent, { bookData }, context) => {
      // if user has a token (is logged in)
      if (context.user) {
        // add bookData to savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    // removeBook is a DELETE request to remove a book from `savedBooks`
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
