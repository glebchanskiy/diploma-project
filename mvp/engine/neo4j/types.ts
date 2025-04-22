export type Node = {
  id: {
    low: number;
  };
  name: string;
  description: string;
  childCount: number;
  path: {
    id: number;
    name: string;
  }[];
};

export type NeoSearchResult = {
  visitedNodesIds: number[];
  knowledgeBaseFragment: string;
  paths: Map<number, NeoSearchPath>;
};

export type NeoSearchPath = { id: { low: number }; name: string }[];
