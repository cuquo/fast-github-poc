/**
 * @generated SignedSource<<bd20783e47b49f65e55cc420c2c560ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BlobByPathQuery$variables = {
  expr: string;
  name: string;
  owner: string;
  path?: string | null | undefined;
  withMeta?: boolean | null | undefined;
};
export type BlobByPathQuery$data = {
  readonly repository: {
    readonly defaultBranchRef?: {
      readonly target: {
        readonly history?: {
          readonly nodes: ReadonlyArray<{
            readonly abbreviatedOid: string;
            readonly associatedPullRequests: {
              readonly nodes: ReadonlyArray<{
                readonly number: number;
                readonly url: any;
              } | null | undefined> | null | undefined;
            } | null | undefined;
            readonly author: {
              readonly name: string | null | undefined;
              readonly user: {
                readonly avatarUrl: any;
                readonly login: string;
                readonly url: any;
              } | null | undefined;
            } | null | undefined;
            readonly messageHeadline: string;
            readonly oid: any;
            readonly url: any;
          } | null | undefined> | null | undefined;
        };
      } | null | undefined;
    } | null | undefined;
    readonly object: {
      readonly byteSize?: number;
      readonly isBinary?: boolean | null | undefined;
      readonly isTruncated?: boolean;
      readonly text?: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type BlobByPathQuery = {
  response: BlobByPathQuery$data;
  variables: BlobByPathQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "expr"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "path"
},
v4 = {
  "defaultValue": false,
  "kind": "LocalArgument",
  "name": "withMeta"
},
v5 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }
],
v6 = [
  {
    "kind": "Variable",
    "name": "expression",
    "variableName": "expr"
  }
],
v7 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "text",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isBinary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isTruncated",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "byteSize",
      "storageKey": null
    }
  ],
  "type": "Blob",
  "abstractKey": null
},
v8 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v9 = [
  (v8/*: any*/),
  {
    "kind": "Variable",
    "name": "path",
    "variableName": "path"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oid",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "abbreviatedOid",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageHeadline",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "size",
      "value": 40
    }
  ],
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": "avatarUrl(size:40)"
},
v17 = [
  (v8/*: any*/)
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "BlobByPathQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v6/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          {
            "condition": "withMeta",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Ref",
                "kind": "LinkedField",
                "name": "defaultBranchRef",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "target",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v9/*: any*/),
                            "concreteType": "CommitHistoryConnection",
                            "kind": "LinkedField",
                            "name": "history",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Commit",
                                "kind": "LinkedField",
                                "name": "nodes",
                                "plural": true,
                                "selections": [
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v12/*: any*/),
                                  (v13/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v14/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v15/*: any*/),
                                          (v13/*: any*/),
                                          (v16/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": (v17/*: any*/),
                                    "concreteType": "PullRequestConnection",
                                    "kind": "LinkedField",
                                    "name": "associatedPullRequests",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PullRequest",
                                        "kind": "LinkedField",
                                        "name": "nodes",
                                        "plural": true,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v13/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "associatedPullRequests(first:1)"
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "Commit",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "BlobByPathQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v6/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v19/*: any*/),
              (v7/*: any*/),
              (v20/*: any*/)
            ],
            "storageKey": null
          },
          {
            "condition": "withMeta",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Ref",
                "kind": "LinkedField",
                "name": "defaultBranchRef",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "target",
                    "plural": false,
                    "selections": [
                      (v19/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v9/*: any*/),
                            "concreteType": "CommitHistoryConnection",
                            "kind": "LinkedField",
                            "name": "history",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Commit",
                                "kind": "LinkedField",
                                "name": "nodes",
                                "plural": true,
                                "selections": [
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v12/*: any*/),
                                  (v13/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v14/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v15/*: any*/),
                                          (v13/*: any*/),
                                          (v16/*: any*/),
                                          (v20/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": (v17/*: any*/),
                                    "concreteType": "PullRequestConnection",
                                    "kind": "LinkedField",
                                    "name": "associatedPullRequests",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "PullRequest",
                                        "kind": "LinkedField",
                                        "name": "nodes",
                                        "plural": true,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v13/*: any*/),
                                          (v20/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "associatedPullRequests(first:1)"
                                  },
                                  (v20/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "Commit",
                        "abstractKey": null
                      },
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v20/*: any*/)
                ],
                "storageKey": null
              }
            ]
          },
          (v20/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "90b2ae180080d9a4682ea029f490290d",
    "id": null,
    "metadata": {},
    "name": "BlobByPathQuery",
    "operationKind": "query",
    "text": "query BlobByPathQuery($owner:String!,$name:String!,$expr:String!,$withMeta:Boolean=false,$path:String){repository(owner:$owner,name:$name){object(expression:$expr){__typename,...on Blob{text,isBinary,isTruncated,byteSize},id},defaultBranchRef@include(if:$withMeta){target{__typename,...on Commit{history(first:1,path:$path){nodes{oid,abbreviatedOid,messageHeadline,url,author{name,user{login,url,avatarUrl(size:40),id}},associatedPullRequests(first:1){nodes{number,url,id}},id}}},id},id},id}}"
  }
};
})();

(node as any).hash = "15927de6281a1c62761a202ea20cf329";

export default node;
