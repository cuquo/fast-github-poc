import { graphql } from 'relay-runtime';

export const OwnerQuery = graphql`
  query OwnerQuery($login: String!) {
    repositoryOwner(login: $login) {
      __typename
      login
      ... on User {
        name bio followers { totalCount }
      }
      ... on Organization {
        name description membersWithRole { totalCount }
      }
    }
    rateLimit { remaining }
  }
`;
