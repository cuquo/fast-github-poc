import { graphql } from 'relay-runtime';

export const PRFilesFragment = graphql`
  fragment PRFilesFragment on PullRequestChangedFileConnection {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      path
      additions
      deletions
      changeType
      viewerViewedState
    }
  }
`;
