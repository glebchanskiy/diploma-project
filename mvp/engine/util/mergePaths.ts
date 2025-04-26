import type { NeoSearchPath } from "../neo4j/types.ts";

const getFirst = (path: NeoSearchPath) => {
  return  path.at(0)
}

const getLast = (path: NeoSearchPath) => {
  return path.at((path.length ?? 1) - 1)
}

export const mergePaths = (paths: NeoSearchPath[]): string[]  => {
  const path = []
  
  const currentPath = paths.at(0)!
  let currentPathLast = getLast(currentPath)

  path.push(...currentPath.map(p => p.name))

  for (const p of paths) {
    const f = getFirst(p)

    if (f?.name === currentPathLast?.name) {
      currentPathLast = getLast(p)
      path.push(...p.filter((_ignore, i) => i !== 0).map(p => p.name))
    }
  }

  return path
}