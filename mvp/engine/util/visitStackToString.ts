import type { Node } from "@knowledgeBase/types.ts";

export const visitStackToString = (stack: Node[]) => {
    return stack.map(n => `${n.id}:${n.name}`)
}
