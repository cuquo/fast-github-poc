import { graphql } from 'relay-runtime';

export const TreeQuery = graphql`
  query TreeQuery(
	$owner: String!
	$name: String!
	$expr: String!
	$withMeta: Boolean = true
	$path: String
) {
	repository(owner: $owner, name: $name) {
		files: object(expression: $expr) {
			__typename
			...TreeFragment @alias(as: "treeHierarchyFragment")
		}

		# Optional commit metadata for the given path
		defaultBranchRef @include(if: $withMeta) {
			__typename
			name
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
