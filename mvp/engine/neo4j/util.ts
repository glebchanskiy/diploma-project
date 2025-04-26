import type { Record, RecordShape } from "@neo4j";
import type { NeoSearchPath, Node } from "@knowledgeBase/types.ts";

export const trnasformToNodes = (
  records: Record<RecordShape, PropertyKey, RecordShape<PropertyKey, number>>[],
): Node[] =>
  records.map((record) => ({
    id: record.get("nodeId"),
    name: record.get("name"),
    description: record.get("description"),
    childCount: safeGet(record, "child_count"),
    path: safeGet(record, "full_path"),
    childIds: safeGet(record, "childIds")
  }));


const safeGet = (kek: any, prop: string) => {
    try {
        return kek.get(prop)
    } catch {
        return undefined
    }
}

export const toPathsMap = (nodes: Node[]): Map<number, NeoSearchPath> => {
  const paths = new Map()
  nodes.forEach(node => paths.set(node.id.low, node.path))

  return paths
}

export const toNodesMap = (nodes: Node[]): Map<number, Node> => {
  const paths = new Map()
  nodes.forEach(node => paths.set(node.id.low, node))

  return paths
}
