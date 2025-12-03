import { graphql } from 'relay-runtime';

/** Used for fetching a pull request and its changed files */
export const PullRequestQuery = graphql`
  query PullRequestQuery(
    $owner: String!
    $name: String!
    $number: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      pullRequest(number: $number) {
        id
        number
        title
        state
        url
        createdAt
        merged
        mergedAt
        closed

        additions
        deletions
        changedFiles
        totalCommentsCount

        commits(last: 1) {
          __typename
          totalCount
          nodes {
            commit {
              oid
              status {
                state
                contexts {
                  context
                  state
                  description
                }
              }
              checkSuites(first: 100) {
                totalCount
                nodes {
                  app {
                    name
                  }
                  conclusion
                  status
                  checkRuns(first: 100) {
                    totalCount
                    nodes {
                      name
                      status
                      conclusion
                    }
                  }
                }
              }
            }
          }
        }

        baseRefName
        baseRefOid
        headRefName
        headRefOid

        baseRepository {
          id
          name
          owner {
            login
          }
        }

        headRepository {
          id
          name
          owner {
            login
          }
        }

        author {
          login
          url
          avatarUrl(size: 40)
          ... on User {
            name
          }
        }

        files(first: 100, after: $after) {
          ...PRFilesFragment
        }
      }
    }
  }
`;
