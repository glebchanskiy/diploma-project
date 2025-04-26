import type { Node } from "../neo4j/types.ts";

export const visitStackToString = (stack: Node[]) => {
    return stack.map(n => `${n.id}:${n.name}`)
}
