/**
 * @generated SignedSource<<20fc36bdd4e8dd9654881217cb23a6d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CheckConclusionState = "ACTION_REQUIRED" | "CANCELLED" | "FAILURE" | "NEUTRAL" | "SKIPPED" | "STALE" | "STARTUP_FAILURE" | "SUCCESS" | "TIMED_OUT" | "%future added value";
export type CheckStatusState = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "QUEUED" | "REQUESTED" | "WAITING" | "%future added value";
export type PullRequestState = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
export type StatusState = "ERROR" | "EXPECTED" | "FAILURE" | "PENDING" | "SUCCESS" | "%future added value";
export type PullRequestQuery$variables = {
  after?: string | null | undefined;
  name: string;
  number: number;
  owner: string;
};
export type PullRequestQuery$data = {
  readonly repository: {
    readonly pullRequest: {
      readonly additions: number;
      readonly author: {
        readonly avatarUrl: any;
        readonly login: string;
        readonly name?: string | null | undefined;
        readonly url: any;
      } | null | undefined;
      readonly baseRefName: string;
      readonly baseRefOid: any;
      readonly baseRepository: {
        readonly id: string;
        readonly name: string;
        readonly owner: {
          readonly login: string;
        };
      } | null | undefined;
      readonly changedFiles: number;
      readonly closed: boolean;
      readonly commits: {
        readonly __typename: "PullRequestCommitConnection";
        readonly nodes: ReadonlyArray<{
          readonly commit: {
            readonly checkSuites: {
              readonly nodes: ReadonlyArray<{
                readonly app: {
                  readonly name: string;
                } | null | undefined;
                readonly checkRuns: {
                  readonly nodes: ReadonlyArray<{
                    readonly conclusion: CheckConclusionState | null | undefined;
                    readonly name: string;
                    readonly status: CheckStatusState;
                  } | null | undefined> | null | undefined;
                  readonly totalCount: number;
                } | null | undefined;
                readonly conclusion: CheckConclusionState | null | undefined;
                readonly status: CheckStatusState;
              } | null | undefined> | null | undefined;
              readonly totalCount: number;
            } | null | undefined;
            readonly oid: any;
            readonly status: {
              readonly contexts: ReadonlyArray<{
                readonly context: string;
                readonly description: string | null | undefined;
                readonly state: StatusState;
              }>;
              readonly state: StatusState;
            } | null | undefined;
          };
        } | null | undefined> | null | undefined;
        readonly totalCount: number;
      };
      readonly createdAt: any;
      readonly deletions: number;
      readonly files: {
        readonly " $fragmentSpreads": FragmentRefs<"PRFilesFragment">;
      } | null | undefined;
      readonly headRefName: string;
      readonly headRefOid: any;
      readonly headRepository: {
        readonly id: string;
        readonly name: string;
        readonly owner: {
          readonly login: string;
        };
      } | null | undefined;
      readonly id: string;
      readonly merged: boolean;
      readonly mergedAt: any | null | undefined;
      readonly number: number;
      readonly state: PullRequestState;
      readonly title: string;
      readonly totalCommentsCount: number | null | undefined;
      readonly url: any;
    } | null | undefined;
  } | null | undefined;
};
export type PullRequestQuery = {
  response: PullRequestQuery$data;
  variables: PullRequestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "number"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v4 = [
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
v5 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "number"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "merged",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mergedAt",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "closed",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "additions",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletions",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "changedFiles",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCommentsCount",
  "storageKey": null
},
v19 = [
  {
    "kind": "Literal",
    "name": "last",
    "value": 1
  }
],
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oid",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "context",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v25 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v26 = [
  (v25/*: any*/)
],
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v28 = [
  (v27/*: any*/)
],
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "conclusion",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "baseRefName",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "baseRefOid",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headRefName",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headRefOid",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v36 = [
  (v6/*: any*/),
  (v27/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "owner",
    "plural": false,
    "selections": [
      (v35/*: any*/)
    ],
    "storageKey": null
  }
],
v37 = {
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
v38 = {
  "kind": "InlineFragment",
  "selections": (v28/*: any*/),
  "type": "User",
  "abstractKey": null
},
v39 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  (v25/*: any*/)
],
v40 = [
  (v6/*: any*/),
  (v27/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "owner",
    "plural": false,
    "selections": [
      (v20/*: any*/),
      (v35/*: any*/),
      (v6/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PullRequestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "PullRequest",
            "kind": "LinkedField",
            "name": "pullRequest",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              {
                "alias": null,
                "args": (v19/*: any*/),
                "concreteType": "PullRequestCommitConnection",
                "kind": "LinkedField",
                "name": "commits",
                "plural": false,
                "selections": [
                  (v20/*: any*/),
                  (v21/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PullRequestCommit",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Commit",
                        "kind": "LinkedField",
                        "name": "commit",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Status",
                            "kind": "LinkedField",
                            "name": "status",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StatusContext",
                                "kind": "LinkedField",
                                "name": "contexts",
                                "plural": true,
                                "selections": [
                                  (v23/*: any*/),
                                  (v9/*: any*/),
                                  (v24/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": (v26/*: any*/),
                            "concreteType": "CheckSuiteConnection",
                            "kind": "LinkedField",
                            "name": "checkSuites",
                            "plural": false,
                            "selections": [
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CheckSuite",
                                "kind": "LinkedField",
                                "name": "nodes",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "App",
                                    "kind": "LinkedField",
                                    "name": "app",
                                    "plural": false,
                                    "selections": (v28/*: any*/),
                                    "storageKey": null
                                  },
                                  (v29/*: any*/),
                                  (v30/*: any*/),
                                  {
                                    "alias": null,
                                    "args": (v26/*: any*/),
                                    "concreteType": "CheckRunConnection",
                                    "kind": "LinkedField",
                                    "name": "checkRuns",
                                    "plural": false,
                                    "selections": [
                                      (v21/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CheckRun",
                                        "kind": "LinkedField",
                                        "name": "nodes",
                                        "plural": true,
                                        "selections": [
                                          (v27/*: any*/),
                                          (v30/*: any*/),
                                          (v29/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "checkRuns(first:100)"
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "checkSuites(first:100)"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "commits(last:1)"
              },
              (v31/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Repository",
                "kind": "LinkedField",
                "name": "baseRepository",
                "plural": false,
                "selections": (v36/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Repository",
                "kind": "LinkedField",
                "name": "headRepository",
                "plural": false,
                "selections": (v36/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "author",
                "plural": false,
                "selections": [
                  (v35/*: any*/),
                  (v10/*: any*/),
                  (v37/*: any*/),
                  (v38/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v39/*: any*/),
                "concreteType": "PullRequestChangedFileConnection",
                "kind": "LinkedField",
                "name": "files",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PRFilesFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
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
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PullRequestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Repository",
        "kind": "LinkedField",
        "name": "repository",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "PullRequest",
            "kind": "LinkedField",
            "name": "pullRequest",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              {
                "alias": null,
                "args": (v19/*: any*/),
                "concreteType": "PullRequestCommitConnection",
                "kind": "LinkedField",
                "name": "commits",
                "plural": false,
                "selections": [
                  (v20/*: any*/),
                  (v21/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PullRequestCommit",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Commit",
                        "kind": "LinkedField",
                        "name": "commit",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Status",
                            "kind": "LinkedField",
                            "name": "status",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "StatusContext",
                                "kind": "LinkedField",
                                "name": "contexts",
                                "plural": true,
                                "selections": [
                                  (v23/*: any*/),
                                  (v9/*: any*/),
                                  (v24/*: any*/),
                                  (v6/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": (v26/*: any*/),
                            "concreteType": "CheckSuiteConnection",
                            "kind": "LinkedField",
                            "name": "checkSuites",
                            "plural": false,
                            "selections": [
                              (v21/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CheckSuite",
                                "kind": "LinkedField",
                                "name": "nodes",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "App",
                                    "kind": "LinkedField",
                                    "name": "app",
                                    "plural": false,
                                    "selections": [
                                      (v27/*: any*/),
                                      (v6/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v29/*: any*/),
                                  (v30/*: any*/),
                                  {
                                    "alias": null,
                                    "args": (v26/*: any*/),
                                    "concreteType": "CheckRunConnection",
                                    "kind": "LinkedField",
                                    "name": "checkRuns",
                                    "plural": false,
                                    "selections": [
                                      (v21/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CheckRun",
                                        "kind": "LinkedField",
                                        "name": "nodes",
                                        "plural": true,
                                        "selections": [
                                          (v27/*: any*/),
                                          (v30/*: any*/),
                                          (v29/*: any*/),
                                          (v6/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "checkRuns(first:100)"
                                  },
                                  (v6/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "checkSuites(first:100)"
                          },
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "commits(last:1)"
              },
              (v31/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Repository",
                "kind": "LinkedField",
                "name": "baseRepository",
                "plural": false,
                "selections": (v40/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Repository",
                "kind": "LinkedField",
                "name": "headRepository",
                "plural": false,
                "selections": (v40/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "author",
                "plural": false,
                "selections": [
                  (v20/*: any*/),
                  (v35/*: any*/),
                  (v10/*: any*/),
                  (v37/*: any*/),
                  (v38/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v6/*: any*/)
                    ],
                    "type": "Node",
                    "abstractKey": "__isNode"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v39/*: any*/),
                "concreteType": "PullRequestChangedFileConnection",
                "kind": "LinkedField",
                "name": "files",
                "plural": false,
                "selections": [
                  (v21/*: any*/),
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
                      (v15/*: any*/),
                      (v16/*: any*/),
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
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "142cabc3da8efb9c8c16d6eba559fdd0",
    "id": null,
    "metadata": {},
    "name": "PullRequestQuery",
    "operationKind": "query",
    "text": "query PullRequestQuery($owner:String!,$name:String!,$number:Int!,$after:String){repository(owner:$owner,name:$name){pullRequest(number:$number){id,number,title,state,url,createdAt,merged,mergedAt,closed,additions,deletions,changedFiles,totalCommentsCount,commits(last:1){__typename,totalCount,nodes{commit{oid,status{state,contexts{context,state,description,id},id},checkSuites(first:100){totalCount,nodes{app{name,id},conclusion,status,checkRuns(first:100){totalCount,nodes{name,status,conclusion,id}},id}},id},id}},baseRefName,baseRefOid,headRefName,headRefOid,baseRepository{id,name,owner{__typename,login,id}},headRepository{id,name,owner{__typename,login,id}},author{__typename,login,url,avatarUrl(size:40),...on User{name},...on Node{__isNode:__typename,id}},files(first:100,after:$after){...PRFilesFragment}},id}}fragment PRFilesFragment on PullRequestChangedFileConnection{totalCount,pageInfo{hasNextPage,endCursor},nodes{path,additions,deletions,changeType,viewerViewedState}}"
  }
};
})();

(node as any).hash = "a9ec4334372e845ca59b609c8f42c2f9";

export default node;
