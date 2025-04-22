// First query: Get initial results and store last accessed nodeIds
// You'll need to store these nodeIds client-side after the first execution

export const firstLevelQuery = `
MATCH path = (root {name: "Dungeons & Dragons"})-[:DECOMPOSITION*0..2]->(n)
RETURN 
  id(n) AS nodeId,
  n.name AS name,
  n.description AS description,
  [node IN nodes(path) | {id: id(node), name: node.name}] AS full_path,
  size((n)-[:DECOMPOSITION]->()) AS child_count  // Shows if node has children
ORDER BY length(path), n.name
LIMIT 30;
`

// Subsequent query: Continue from specific node (replace with your selected node)
// Use this pattern when you want to explore from a specific node
export const subsequentQuery = `
MATCH path = (startNode)-[:DECOMPOSITION*0..2]->(n)
WHERE id(startNode) = $startNodeId
AND NOT id(n) IN $escapeIds
RETURN 
  id(n) AS nodeId,
  n.name AS name,
  n.description AS description,
  [node IN nodes(path) | {id: id(node), name: node.name}] AS full_path,
  size((n)-[:DECOMPOSITION]->()) AS child_count
ORDER BY length(path), n.name
LIMIT 30;
` 

export const getById = `
MATCH (n) WHERE id(n) = $nId RETURN 
  id(n) AS nodeId,
  n.name AS name,
  n.description AS description
`