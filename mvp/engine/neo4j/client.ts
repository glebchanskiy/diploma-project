import neo4j from "@neo4j";
import { trnasformToNodes } from "./tools.ts";
import { transformToText } from "../utils.ts";
import { firstLevelQuery, getById, subsequentQuery } from "./queries.ts";
import { Node } from "./types.ts";

const URI = "bolt://localhost:7687";
const driver = neo4j.driver(URI, neo4j.auth.basic("neo4j", "secret123"));

// await driver.close();

export const neoSearchFirst = async () => {
  const { records } = await driver.executeQuery(firstLevelQuery);
  const nodes = trnasformToNodes(records);
  const visitedNodes = nodes.map((n) => n.id.low);

  return {
    nodes,
    visitedNodes,
    text: transformToText(nodes),
  };
};

export const neoSearch = async (start: number, visited: number[]) => {
  const { records } = await driver.executeQuery(subsequentQuery, {
    startNodeId: start,
    visitedNodeIds: visited,
  });
  const nodes = trnasformToNodes(records);
  const visitedNodes = nodes.map((n) => n.id.low);

  return {
    nodes,
    visitedNodes,
    text: transformToText(nodes),
  };
};

export const neoSearchById = async (id: number): Promise<Node> => {
    const { records } = await driver.executeQuery(getById, {
        nId: id
    });
    const nodes = trnasformToNodes(records);

    return nodes[0]
}
