/**
 * @generated SignedSource<<50aacb201092af3c0c58909fade76707>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TreeQuery$variables = {
  expr: string;
  name: string;
  owner: string;
  path?: string | null | undefined;
  withMeta?: boolean | null | undefined;
};
export type TreeQuery$data = {
  readonly repository: {
    readonly defaultBranchRef?: {
      readonly __typename: "Ref";
      readonly name: string;
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
    readonly files: {
      readonly __typename: string;
      readonly treeHierarchyFragment: {
        readonly " $fragmentSpreads": FragmentRefs<"TreeFragment">;
      } | null | undefined;
    } | null | undefined;
    readonly openGraphImageUrl: any;
    readonly owner: {
      readonly avatarUrl: any;
    };
  } | null | undefined;
};
export type TreeQuery = {
  response: TreeQuery$data;
  variables: TreeQuery$variables;
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
  "defaultValue": true,
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v12 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v13 = [
  (v12/*: any*/),
  {
    "kind": "Variable",
    "name": "path",
    "variableName": "path"
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oid",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "abbreviatedOid",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageHeadline",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
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
  (v12/*: any*/)
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
    "name": "TreeQuery",
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
            "alias": "files",
            "args": (v9/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v10/*: any*/),
              {
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "TreeFragment"
                    }
                  ],
                  "type": "Tree",
                  "abstractKey": null
                },
                "kind": "AliasedInlineFragmentSpread",
                "name": "treeHierarchyFragment"
              }
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
                  (v10/*: any*/),
                  (v11/*: any*/),
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
                            "args": (v13/*: any*/),
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
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  (v17/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v11/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v17/*: any*/),
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
                                          (v17/*: any*/)
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
    "name": "TreeQuery",
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
              (v10/*: any*/),
              (v8/*: any*/),
              (v22/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": "files",
            "args": (v9/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v10/*: any*/),
              {
                "kind": "InlineFragment",
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
                      (v11/*: any*/),
                      (v14/*: any*/),
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
              },
              (v22/*: any*/)
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
                  (v10/*: any*/),
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "target",
                    "plural": false,
                    "selections": [
                      (v10/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v13/*: any*/),
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
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  (v17/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GitActor",
                                    "kind": "LinkedField",
                                    "name": "author",
                                    "plural": false,
                                    "selections": [
                                      (v11/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "User",
                                        "kind": "LinkedField",
                                        "name": "user",
                                        "plural": false,
                                        "selections": [
                                          (v18/*: any*/),
                                          (v17/*: any*/),
                                          (v19/*: any*/),
                                          (v22/*: any*/)
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
                                          (v17/*: any*/),
                                          (v22/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "associatedPullRequests(first:1)"
                                  },
                                  (v22/*: any*/)
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
                      (v22/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/)
                ],
                "storageKey": null
              }
            ]
          },
          (v22/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "739e60f3ced459c0db791d4961095fb3",
    "id": null,
    "metadata": {},
    "name": "TreeQuery",
    "operationKind": "query",
    "text": "query TreeQuery($owner:String!,$name:String!,$expr:String!,$withMeta:Boolean=true,$path:String){repository(owner:$owner,name:$name){description,openGraphImageUrl,owner{__typename,avatarUrl,id},files:object(expression:$expr){__typename,...TreeFragment,id},defaultBranchRef@include(if:$withMeta){__typename,name,target{__typename,...on Commit{history(first:1,path:$path){nodes{oid,abbreviatedOid,messageHeadline,url,author{name,user{login,url,avatarUrl(size:40),id}},associatedPullRequests(first:1){nodes{number,url,id}},id}}},id},id},id}}fragment TreeFragment on Tree{entries{mode,name,oid,path,type,size}}"
  }
};
})();

(node as any).hash = "fcad3263af2aa0a33d86a4e512d36743";

export default node;
