import type { Node } from "./neo4j/types.ts";

const path = (node: Node) => {
    return node.path.map(p => p.name).join(' -> ')
}

export const transformToText = (nodes: Node[]) => {
    return nodes.map(node => `Knwoledge ID = [${node.id}]:\nPath: ${path(node)}\nTitle: ${node.name}\nDescription: ${node.description}\nChild count: ${node.childCount}`).join('\n\n')
}