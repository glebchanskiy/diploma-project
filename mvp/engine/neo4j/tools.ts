import type { Record, RecordShape } from "@neo4j";
import type { Node } from "./types.ts";

export const trnasformToNodes = (
  records: Record<RecordShape, PropertyKey, RecordShape<PropertyKey, number>>[],
): Node[] =>
  records.map((record) => ({
    id: record.get("nodeId"),
    name: record.get("name"),
    description: record.get("description"),
    childCount: safeGet(record, "child_count"),
    path: safeGet(record, "full_path") //.map((r: { name: any; id: { low: any; }; }) => ({ name: r.name, id: r.id.low })),
  }));


const safeGet = (kek: any, prop: string) => {
    try {
        return kek.get(prop)
    } catch {
        return undefined
    }
}