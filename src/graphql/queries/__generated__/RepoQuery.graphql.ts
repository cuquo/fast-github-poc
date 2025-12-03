/**
 * @generated SignedSource<<5f0f48eb51fb9702390d38c17f2efcf4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StatusState = "ERROR" | "EXPECTED" | "FAILURE" | "PENDING" | "SUCCESS" | "%future added value";
export type RepoQuery$variables = {
  name: string;
  owner: string;
};
export type RepoQuery$data = {
  readonly rateLimit: {
    readonly cost: number;
    readonly remaining: number;
    readonly resetAt: any;
  } | null | undefined;
  readonly repository: {
    readonly __typename: "Repository";
    readonly branches: {
      readonly totalCount: number;
    } | null | undefined;
    readonly defaultBranchRef: {
      readonly __typename: "Ref";
      readonly name: string;
      readonly target: {
        readonly __typename: "Commit";
        readonly __typename: "Commit";
        readonly abbreviatedOid: string;
        readonly author: {
          readonly __typename: "GitActor";
          readonly name: string | null | undefined;
          readonly user: {
            readonly __typename: "User";
            readonly avatarUrl: any;
            readonly login: string;
            readonly url: any;
          } | null | undefined;
        } | null | undefined;
        readonly authors: {
          readonly __typename: "GitActorConnection";
          readonly nodes: ReadonlyArray<{
            readonly __typename: "GitActor";
            readonly name: string | null | undefined;
            readonly user: {
              readonly __typename: "User";
              readonly avatarUrl: any;
              readonly login: string;
            } | null | undefined;
          } | null | undefined> | null | undefined;
          readonly totalCount: number;
        };
        readonly committedDate: any;
        readonly history: {
          readonly __typename: "CommitHistoryConnection";
          readonly totalCount: number;
        };
        readonly messageBody: string;
        readonly messageHeadline: string;
        readonly oid: any;
        readonly statusCheckRollup: {
          readonly __typename: "StatusCheckRollup";
          readonly state: StatusState;
        } | null | undefined;
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      } | null | undefined;
    } | null | undefined;
    readonly description: string | null | undefined;
    readonly files: {
      readonly __typename: string;
      readonly treeHierarchyFragment: {
        readonly " $fragmentSpreads": FragmentRefs<"TreeFragment">;
      } | null | undefined;
    } | null | undefined;
    readonly homepageUrl: any | null | undefined;
    readonly isPrivate: boolean;
    readonly name: string;
    readonly nameWithOwner: string;
    readonly owner: {
      readonly __typename: string;
      readonly avatarUrl: any;
      readonly login: string;
    };
    readonly repositoryTopics: {
      readonly nodes: ReadonlyArray<{
        readonly topic: {
          readonly name: string;
        };
      } | null | undefined> | null | undefined;
    };
    readonly tags: {
      readonly totalCount: number;
    } | null | undefined;
  } | null | undefined;
};
export type RepoQuery = {
  response: RepoQuery$data;
  variables: RepoQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v2 = [
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "expression",
    "value": "HEAD:"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nameWithOwner",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "homepageUrl",
  "storageKey": null
},
v9 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 15
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "size",
      "value": 48
    }
  ],
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": "avatarUrl(size:48)"
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPrivate",
  "storageKey": null
},
v13 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v15 = [
  (v14/*: any*/)
],
v16 = {
  "alias": "branches",
  "args": [
    (v13/*: any*/),
    {
      "kind": "Literal",
      "name": "refPrefix",
      "value": "refs/heads/"
    }
  ],
  "concreteType": "RefConnection",
  "kind": "LinkedField",
  "name": "refs",
  "plural": false,
  "selections": (v15/*: any*/),
  "storageKey": "refs(first:1,refPrefix:\"refs/heads/\")"
},
v17 = {
  "alias": "tags",
  "args": [
    (v13/*: any*/),
    {
      "kind": "Literal",
      "name": "refPrefix",
      "value": "refs/tags/"
    }
  ],
  "concreteType": "RefConnection",
  "kind": "LinkedField",
  "name": "refs",
  "plural": false,
  "selections": (v15/*: any*/),
  "storageKey": "refs(first:1,refPrefix:\"refs/tags/\")"
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oid",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "abbreviatedOid",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "committedDate",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageHeadline",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageBody",
  "storageKey": null
},
v23 = {
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
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v25 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  }
],
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "CommitHistoryConnection",
  "kind": "LinkedField",
  "name": "history",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v14/*: any*/)
  ],
  "storageKey": null
},
v28 = {
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
      "name": "cost",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "remaining",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "resetAt",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v29 = {
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RepoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": "files",
            "args": (v4/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
            "storageKey": "object(expression:\"HEAD:\")"
          },
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "RepositoryTopicConnection",
            "kind": "LinkedField",
            "name": "repositoryTopics",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "RepositoryTopic",
                "kind": "LinkedField",
                "name": "nodes",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Topic",
                    "kind": "LinkedField",
                    "name": "topic",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "repositoryTopics(first:15)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Ref",
            "kind": "LinkedField",
            "name": "defaultBranchRef",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "target",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GitActor",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "User",
                            "kind": "LinkedField",
                            "name": "user",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v10/*: any*/),
                              (v23/*: any*/),
                              (v24/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": (v25/*: any*/),
                        "concreteType": "GitActorConnection",
                        "kind": "LinkedField",
                        "name": "authors",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "GitActor",
                            "kind": "LinkedField",
                            "name": "nodes",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "user",
                                "plural": false,
                                "selections": [
                                  (v3/*: any*/),
                                  (v10/*: any*/),
                                  (v23/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "authors(first:6)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StatusCheckRollup",
                        "kind": "LinkedField",
                        "name": "statusCheckRollup",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v26/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v27/*: any*/)
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
        ],
        "storageKey": null
      },
      (v28/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "RepoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": "files",
            "args": (v4/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "object",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                      (v5/*: any*/),
                      (v18/*: any*/),
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
              (v29/*: any*/)
            ],
            "storageKey": "object(expression:\"HEAD:\")"
          },
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "RepositoryTopicConnection",
            "kind": "LinkedField",
            "name": "repositoryTopics",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "RepositoryTopic",
                "kind": "LinkedField",
                "name": "nodes",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Topic",
                    "kind": "LinkedField",
                    "name": "topic",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v29/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v29/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "repositoryTopics(first:15)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v29/*: any*/)
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Ref",
            "kind": "LinkedField",
            "name": "defaultBranchRef",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "target",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v29/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GitActor",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "User",
                            "kind": "LinkedField",
                            "name": "user",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v10/*: any*/),
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v29/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": (v25/*: any*/),
                        "concreteType": "GitActorConnection",
                        "kind": "LinkedField",
                        "name": "authors",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "GitActor",
                            "kind": "LinkedField",
                            "name": "nodes",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "user",
                                "plural": false,
                                "selections": [
                                  (v3/*: any*/),
                                  (v10/*: any*/),
                                  (v23/*: any*/),
                                  (v29/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "authors(first:6)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StatusCheckRollup",
                        "kind": "LinkedField",
                        "name": "statusCheckRollup",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v26/*: any*/),
                          (v29/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v27/*: any*/)
                    ],
                    "type": "Commit",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              },
              (v29/*: any*/)
            ],
            "storageKey": null
          },
          (v29/*: any*/)
        ],
        "storageKey": null
      },
      (v28/*: any*/)
    ]
  },
  "params": {
    "cacheID": "540af133127ef8d519a0681d8192c9f5",
    "id": null,
    "metadata": {},
    "name": "RepoQuery",
    "operationKind": "query",
    "text": "query RepoQuery($owner:String!,$name:String!){repository(owner:$owner,name:$name){__typename,files:object(expression:\"HEAD:\"){__typename,...TreeFragment,id},name,nameWithOwner,description,homepageUrl,repositoryTopics(first:15){nodes{topic{name,id},id}},owner{__typename,login,avatarUrl(size:48),id},isPrivate,branches:refs(refPrefix:\"refs/heads/\",first:1){totalCount},tags:refs(refPrefix:\"refs/tags/\",first:1){totalCount},defaultBranchRef{__typename,name,target{__typename,...on Commit{__typename,oid,abbreviatedOid,committedDate,messageHeadline,messageBody,author{user{__typename,login,avatarUrl(size:40),url,id},__typename,name},authors(first:6){__typename,totalCount,nodes{user{__typename,login,avatarUrl(size:40),id},__typename,name}},statusCheckRollup{__typename,state,id},history{__typename,totalCount}},id},id},id},rateLimit{cost,remaining,resetAt}}fragment TreeFragment on Tree{entries{mode,name,oid,path,type,size}}"
  }
};
})();

(node as any).hash = "1336a6fcbe565ad80b55d167c296f0c3";

export default node;
