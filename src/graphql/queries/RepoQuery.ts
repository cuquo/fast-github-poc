import { graphql } from 'relay-runtime';

export const RepoQuery = graphql`
  query RepoQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
			__typename
      files: object(expression: "HEAD:") {
        __typename
        ...TreeFragment @alias(as: "treeHierarchyFragment")
      }
      name
      nameWithOwner
      description
      homepageUrl
      repositoryTopics(first: 15) {
        nodes {
          topic {
            name
          }
        }
      }
      owner {
        __typename
        login
        avatarUrl(size: 48)
      }
      isPrivate
      
      branches: refs(refPrefix:"refs/heads/", first:1) {
        totalCount
      }
      tags: refs(refPrefix:"refs/tags/", first:1) {
        totalCount
      }

      defaultBranchRef {
				__typename
        name
        target {
          __typename
          ... on Commit {
						__typename
						oid
            abbreviatedOid
            committedDate
            messageHeadline
            messageBody

            # Main author (committer/author principal)
            author {
              user {
                __typename
                login
                avatarUrl(size: 40)
                url
              }
              __typename
              name
            }

            # Multiple authors (co-authors from trailers)
            authors(first: 6) {
              __typename
              totalCount
              nodes {
                user {
                  __typename
                  login
                  avatarUrl(size: 40)
                }
                __typename
                name
              }
            }

            # PR association, e.g. "(#24330)"
            # associatedPullRequests(first: 1) {
            #   __typename
            #   nodes {
            #     __typename
            #     number
            #     url
            #   }
            # }

            # Red X / green check aggregate
            statusCheckRollup {
              __typename
              state # SUCCESS | FAILURE | PENDING | EXPECTED | ERROR
            }

            # For "13,977 Commits"
            history {
              __typename
              totalCount
            }
          }
        }
      }
    }
    rateLimit {
      cost
      remaining
      resetAt
    }
  }
`;
