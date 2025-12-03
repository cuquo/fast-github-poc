/**
 * @generated SignedSource<<25961621c0d2cd09b557965a94a9c60c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type FileViewedState = "DISMISSED" | "UNVIEWED" | "VIEWED" | "%future added value";
export type PatchStatus = "ADDED" | "CHANGED" | "COPIED" | "DELETED" | "MODIFIED" | "RENAMED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type PRFilesFragment$data = {
  readonly nodes: ReadonlyArray<{
    readonly additions: number;
    readonly changeType: PatchStatus;
    readonly deletions: number;
    readonly path: string;
    readonly viewerViewedState: FileViewedState;
  } | null | undefined> | null | undefined;
  readonly pageInfo: {
    readonly endCursor: string | null | undefined;
    readonly hasNextPage: boolean;
  };
  readonly totalCount: number;
  readonly " $fragmentType": "PRFilesFragment";
};
export type PRFilesFragment$key = {
  readonly " $data"?: PRFilesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PRFilesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PRFilesFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PageInfo",
      "kind": "LinkedField",
      "name": "pageInfo",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hasNextPage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endCursor",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PullRequestChangedFile",
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": [
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
          "name": "additions",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "deletions",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "changeType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "viewerViewedState",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "PullRequestChangedFileConnection",
  "abstractKey": null
};

(node as any).hash = "0f2c781b092399294d9ef7b11b1eea30";

export default node;
