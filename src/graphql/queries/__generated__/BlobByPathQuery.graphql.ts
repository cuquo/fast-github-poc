/**
 * @generated SignedSource<<28441ec55a6195d07fe4bebfa002f1e2>>
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
    readonly description: string | null | undefined;
    readonly object: {
      readonly byteSize?: number;
      readonly isBinary?: boolean | null | undefined;
      readonly isTruncated?: boolean;
      readonly text?: string | null | undefined;
    } | null | undefined;
    readonly openGraphImageUrl: any;
    readonly owner: {
      readonly avatarUrl: any;
    };
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "openGraphImageUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v9 = [
  {
    "kind": "Variable",
    "name": "expression",
    "variableName": "expr"
  }
],
v10 = {
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
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v12 = [
  (v11/*: any*/),
  {
    "kind": "Variable",
    "name": "path",
    "variableName": "path"
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oid",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "abbreviatedOid",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageHeadline",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v19 = {
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
v20 = [
  (v11/*: any*/)
],
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v23 = {
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
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v10/*: any*/)
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
                            "args": (v12/*: any*/),
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
                                  (v13/*: any*/),
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v17/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v16/*: any*/),
                                          (v19/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": (v20/*: any*/),
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
                                          (v21/*: any*/),
                                          (v16/*: any*/)
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
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v22/*: any*/),
              (v8/*: any*/),
              (v23/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v22/*: any*/),
              (v10/*: any*/),
              (v23/*: any*/)
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
                      (v22/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v12/*: any*/),
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
                                  (v13/*: any*/),
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v17/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v16/*: any*/),
                                          (v19/*: any*/),
                                          (v23/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": (v20/*: any*/),
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
                                          (v21/*: any*/),
                                          (v16/*: any*/),
                                          (v23/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "associatedPullRequests(first:1)"
                                  },
                                  (v23/*: any*/)
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
                      (v23/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v23/*: any*/)
                ],
                "storageKey": null
              }
            ]
          },
          (v23/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "172e2afe619515b03c1887531fe56d69",
    "id": null,
    "metadata": {},
    "name": "BlobByPathQuery",
    "operationKind": "query",
    "text": "query BlobByPathQuery($owner:String!,$name:String!,$expr:String!,$withMeta:Boolean=false,$path:String){repository(owner:$owner,name:$name){description,openGraphImageUrl,owner{__typename,avatarUrl,id},object(expression:$expr){__typename,...on Blob{text,isBinary,isTruncated,byteSize},id},defaultBranchRef@include(if:$withMeta){target{__typename,...on Commit{history(first:1,path:$path){nodes{oid,abbreviatedOid,messageHeadline,url,author{name,user{login,url,avatarUrl(size:40),id}},associatedPullRequests(first:1){nodes{number,url,id}},id}}},id},id},id}}"
  }
};
})();

(node as any).hash = "e5a986c48978b8e9aee2234ddf634cfd";

export default node;
