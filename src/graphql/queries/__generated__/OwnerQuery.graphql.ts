/**
 * @generated SignedSource<<a27ad03f87354145866dacd0001b5580>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OwnerQuery$variables = {
  login: string;
};
export type OwnerQuery$data = {
  readonly rateLimit: {
    readonly remaining: number;
  } | null | undefined;
  readonly repositoryOwner: {
    readonly __typename: string;
    readonly bio?: string | null | undefined;
    readonly description?: string | null | undefined;
    readonly followers?: {
      readonly totalCount: number;
    };
    readonly login: string;
    readonly membersWithRole?: {
      readonly totalCount: number;
    };
    readonly name?: string | null | undefined;
  } | null | undefined;
};
export type OwnerQuery = {
  response: OwnerQuery$data;
  variables: OwnerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "login"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "login"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "totalCount",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FollowerConnection",
      "kind": "LinkedField",
      "name": "followers",
      "plural": false,
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "OrganizationMemberConnection",
      "kind": "LinkedField",
      "name": "membersWithRole",
      "plural": false,
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "RateLimit",
  "kind": "LinkedField",
  "name": "rateLimit",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "remaining",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OwnerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "repositoryOwner",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      (v8/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "OwnerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "repositoryOwner",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v8/*: any*/)
    ]
  },
  "params": {
    "cacheID": "699a5164213b52b422a994aa951d0ed2",
    "id": null,
    "metadata": {},
    "name": "OwnerQuery",
    "operationKind": "query",
    "text": "query OwnerQuery($login:String!){repositoryOwner(login:$login){__typename,login,...on User{name,bio,followers{totalCount}},...on Organization{name,description,membersWithRole{totalCount}},id},rateLimit{remaining}}"
  }
};
})();

(node as any).hash = "5a5de5ed193fd242f93d1f420c3c850e";

export default node;
