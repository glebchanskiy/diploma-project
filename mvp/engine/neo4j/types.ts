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
