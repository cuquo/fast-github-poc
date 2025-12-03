import { graphql } from 'relay-runtime';

/** Used for fetching a blob by its object ID, likes README with redirects */
export const BlobByOidQuery = graphql`
  query BlobByOidQuery($owner: String!, $name: String!, $oid: GitObjectID!) {
    repository(owner: $owner, name: $name) {
      object(oid: $oid) { ... on Blob { text } }
    }
  }
`;
