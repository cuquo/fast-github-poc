import { graphql } from 'relay-runtime';

/** Used for fetching a pull request files */
export const PullRequestFilesQuery = graphql`
  query PullRequestFilesQuery(
    $owner: String!
    $name: String!
    $number: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      pullRequest(number: $number) {
        files(first: 100, after: $after) {
          ...PRFilesFragment
        }
      }
    }
  }
`;
