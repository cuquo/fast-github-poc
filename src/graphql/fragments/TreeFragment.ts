import { graphql } from 'relay-runtime';

export const TreeFragment = graphql`
  fragment TreeFragment on Tree {
    entries {
      mode
      name
      oid
      path
      type # 'blob' | 'tree' | 'commit'
      size
    }
  }
`;
