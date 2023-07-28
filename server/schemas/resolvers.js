const { User } = require("../models");

const resolvers = {
  Query: {
    // users: async () => {
    //   return await User.find({}).populate("savedBooks");
    // },
    user: async (parent, args) => {
      return await User.findById(args.id);
    },
    books: async () => {
      return await Book.find({});
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      return await User.create({ username, email, password });
    },
  },
};

module.exports = resolvers;
