/**
 * @generated SignedSource<<3f7da26d532389cde6a6ca45ca7c1c2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TreeFragment$data = {
  readonly entries: ReadonlyArray<{
    readonly mode: number;
    readonly name: string;
    readonly oid: any;
    readonly path: string | null | undefined;
    readonly size: number;
    readonly type: string;
  }> | null | undefined;
  readonly " $fragmentType": "TreeFragment";
};
export type TreeFragment$key = {
  readonly " $data"?: TreeFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TreeFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TreeFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TreeEntry",
      "kind": "LinkedField",
      "name": "entries",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "mode",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "oid",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "path",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Tree",
  "abstractKey": null
};

(node as any).hash = "7fdaec6dab575944a256bafd742ba625";

export default node;
