import { graphql } from 'relay-runtime';

export const BlobByPathQuery = graphql`
  query BlobByPathQuery(
    $owner: String!
    $name: String!
    $expr: String!
    $withMeta: Boolean = false
    $path: String
  ) {
    repository(owner: $owner, name: $name) {
      object(expression: $expr) {
        ... on Blob {
          text
          isBinary
          isTruncated
          byteSize
        }
      }

      defaultBranchRef @include(if: $withMeta) {
        target {
          ... on Commit {
            history(first: 1, path: $path) {
              nodes {
                oid
                abbreviatedOid
                messageHeadline
                url
                author {
                  name
                  user {
                    login
                    url
                    avatarUrl(size: 40)
                  }
                }
                associatedPullRequests(first: 1) {
                  nodes {
                    number
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
