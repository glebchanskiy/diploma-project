import neo4j from "@neo4j";
import { toPathsMap, trnasformToNodes } from "./util.ts";
import { firstLevelQuery, getById, subsequentQuery } from "./queries.ts";
import type { NeoSearchResult, Node } from "./types.ts";
import { transformToText } from "../util/transform.ts";

const URI = "bolt://localhost:7687";
const driver = neo4j.driver(URI, neo4j.auth.basic("neo4j", "secret123"));

// await driver.close();

export const neoSearchFirst = async (): Promise<NeoSearchResult> => {
  const { records } = await driver.executeQuery(firstLevelQuery);
  const nodes = trnasformToNodes(records);
  const visitedNodesIds = nodes.map((n) => n.id.low);

  console.log(`Neo4j first-level search executed. Records found: ${nodes.length}.`)

  return {
    visitedNodesIds,
    knowledgeBaseFragment: transformToText(nodes),
    paths: toPathsMap(nodes)
  };
};

type NeoSearchProps = {
  startNodeId: number
  escapeIds: number[]
}

export const neoSearch = async ({startNodeId, escapeIds }: NeoSearchProps): Promise<NeoSearchResult> => {
  const { records } = await driver.executeQuery(subsequentQuery, {
    startNodeId,
    escapeIds,
  });
  const nodes = trnasformToNodes(records);
  const visitedNodesIds = nodes.map((n) => n.id.low);

  console.log(`Neo4j search executed. Start node: [id=${startNodeId},title=${(await neoSearchById(startNodeId)).name}]. Records found: ${nodes.length}.`)

  const paths = new Map()
  nodes.forEach(node => paths.set(node.id, node.path))

  return {
    visitedNodesIds,
    knowledgeBaseFragment: transformToText(nodes),
    paths: toPathsMap(nodes)
  };
};

export const neoSearchById = async (id: number): Promise<Node> => {
    const { records } = await driver.executeQuery(getById, {
        nId: id
    });
    const nodes = trnasformToNodes(records);

    return nodes[0]
}
