import { gql } from "@apollo/client";

// query is the GET request -> client side front end
// when fetching data in the pages everything is commig by body

export const QUERY_USER = gql`
  {
    user {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;
