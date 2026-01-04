import 'server-only';

import type { KeyType, KeyTypeData } from 'react-relay/relay-hooks/helpers';
import {
  type GraphQLTaggedNode,
  getFragment,
  getSelector,
} from 'relay-runtime';

import { getServerEnvironment } from './environment';

// A custom hook to read the data of a fragment from the store.
// This is a simplified version of the useFragment hook from react-relay.
// This is intended to be used in only React Server Components.
// It does not support plural fragments.

/**
 * getServerFragment
 *
 * @param fragmentInput - The input fragment
 * @param fragmentRef - The reference to the fragment data
 * @returns The data for the fragment
 */
export default function getServerFragment<TKey extends KeyType>(
  fragmentInput: GraphQLTaggedNode,
  fragmentRef: TKey | null | undefined,
): KeyTypeData<TKey> {
  const environment = getServerEnvironment();

  if (fragmentRef == null) {
    return null;
  }

  const fragmentSelector = getSelector(getFragment(fragmentInput), fragmentRef);
  if (fragmentSelector.kind === 'PluralReaderSelector') {
    throw new Error('Support for plural fragments is not implemented, yet.');
  } else {
    return environment.lookup(fragmentSelector).data;
  }
}
