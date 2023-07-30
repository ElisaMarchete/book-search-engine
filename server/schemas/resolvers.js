const { User } = require("../models");

const resolvers = {
  Query: {
   me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    }
  },

  Mutation: {
  


    addUser: async (parent, { username, email, password }) => {
      return await User.create({ username, email, password });
    },
  },
};

module.exports = resolvers;
