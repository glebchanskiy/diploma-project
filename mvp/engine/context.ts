import { neoSearch, neoSearchById, neoSearchFirst } from "./neo4j/client.ts";
import { llmRequest } from "./ai/client.ts";
import { PromptCreator } from "./prompt/creator.ts";
import { clearJson } from "./util/clearJson.ts";
import { parseLLMJson } from "./util/parseLLMJson.ts";
import type { NeoSearchPath, Node } from "./neo4j/types.ts";
import { mergePaths } from "./util/mergePaths.ts";

type State = {
  query: string;
  maxDivesCount?: number;
};

export type LLMResponse = {
  needToVisit?: number[];
  foundedKnowledgeID?: number;
  auxiliaryKnowledge?: number[];
  comment: string;
};

export class Context {
  private iteration = 0;
  private panicMode = false;
  private history: { req: string; res: string }[] = [];
  private visitedNodes: Set<number> = new Set();
  private needToVisitStack: Node[] = [];
  private foundedKnowledgeID: number | undefined;
  private auxiliaryKnowledge?: number[]
  private comments: string[] = [];

  private pathHistory: NeoSearchPath[] = []

  constructor(private state: State) {
  }

  public isFound() {
    return !!this.foundedKnowledgeID || this.panicMode;
  }

  public async executeNextSearch() {
    if (this.iteration >= this.state.maxDivesCount!) {
      return this.panicMode = true;
    }

    console.log(`Search execution #${this.iteration++}`);

    let result;
    if (this.visitedNodes.size === 0 || this.needToVisitStack.length === 0) {
      result = await neoSearchFirst();
    } else {
      const startNodeId = this.needToVisitStack.pop()

      if (!startNodeId) {
        this.panicMode = true
        return this
      }

      this.pathHistory.push(startNodeId.path.map(k => ({id: {low: k.id}, name: k.name})))

      result = await neoSearch({
        escapeIds: [...this.visitedNodes],
        startNodeId: startNodeId.id.low,
      });
      this.pathHistory.push()
    }
    
    result.visitedNodesIds.forEach((n) => this.visitedNodes.add(n));

    const query = this.state.query;
    const knowledge = result.knowledgeBaseFragment;
    const history = this.history;

    const llmResponse = await llmRequest(
      PromptCreator.search({ query, knowledge, history }),
    ).then(clearJson).then(parseLLMJson);

    if (!llmResponse) {
      return this;
    }

    if (llmResponse.needToVisit) {
      this.needToVisitStack = this.filterNneedToVisit(llmResponse.needToVisit, result.nodes);
    }

    if (llmResponse.foundedKnowledgeID) {
      this.foundedKnowledgeID = llmResponse.foundedKnowledgeID;
      const path = result.paths.get(llmResponse.foundedKnowledgeID)
      if (path)
        this.pathHistory.push(path)
    }

    if (llmResponse.auxiliaryKnowledge) {
      this.auxiliaryKnowledge = llmResponse.auxiliaryKnowledge
    }

    if (llmResponse.comment) {
      this.comments.push(llmResponse.comment);
    }

    console.log("LLM Response:\n", llmResponse);
    console.log();

    return this;
  }

  private async ok() {
    const knowledgeNode = await neoSearchById(this.foundedKnowledgeID!);

    const query = this.state.query;
    const knowledge =
      `Knowledge[id=${knowledgeNode.id},name=${knowledgeNode.name},content=${knowledgeNode.description}]`;
    const comments = this.comments.map((c, i) => `Step ${i + 1}: ${c}`)
      .join("\n");

    const auxiliary = (await Promise.all(this.auxiliaryKnowledge?.map(async a => await neoSearchById(a)) ?? []))
    .map(knowledgeNode => `Knowledge[id=${knowledgeNode.id},name=${knowledgeNode.name},content=${knowledgeNode.description}]`)
    .join('\n')

    const result = await llmRequest(PromptCreator.finalize({ query, knowledge, auxiliary, comments }));

    console.log('\nSuccessfully executed. Search answer:\n', result)
    return result
  }

  private async failed() {
    const query = this.state.query;
    const knowledge =
      `Knowledge[NotFound] (После множества безуспешных попыток сработало ограничение поиска)`;
    const comments = this.comments.map((c, i) => `Step ${i + 1}: ${c}`)
      .join("\n");

    const auxiliary = undefined

    const result = await llmRequest(PromptCreator.finalize({ query, knowledge, auxiliary, comments }));
  
    console.log('\nExecution failed. Search answer:\n', result)
    return result;
  }

  public result() {
    if (this.panicMode) return this.failed();

    return this.ok();
  }

  public meta() {
    return {
      path: mergePaths(this.pathHistory)
    }
  }

  private filterNneedToVisit(needToVisit: number[], nodesMap: Map<number, Node>) {
    return [
      ...this.needToVisitStack,
      ...needToVisit
        .map(n => nodesMap.get(n)!)
        .filter((n) => !this.needToVisitStack.find(v => v.id?.low == n?.id?.low))
        .reverse(),
    ];
  }
}
