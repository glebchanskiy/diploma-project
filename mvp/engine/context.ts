import { neoSearch, neoSearchById, neoSearchFirst } from "./neo4j/client.ts";
import { llmRequest } from "./ai/client.ts";
import { PromptCreator } from "./prompt/creator.ts";
import { clearJson } from "./util/clearJson.ts";
import { parseLLMJson } from "./util/parseLLMJson.ts";
import { NeoSearchPath } from "./neo4j/types.ts";

type State = {
  query: string;
  maxDivesCount?: number;
};

export type LLMResponse = {
  needToVisit?: number[];
  foundedKnowledgeID?: number;
  comment: string;
};

export class Context {
  private iteration = 0;
  private panicMode = false;
  private history: { req: string; res: string }[] = [];
  private visitedNodes: Set<number> = new Set();
  private needToVisitStack: {id: number, name: string}[] = [];
  private foundedKnowledgeID: number | undefined;
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

      result = await neoSearch({
        escapeIds: [...this.visitedNodes],
        startNodeId,
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
      this.needToVisitStack = this.filterNneedToVisit(llmResponse.needToVisit);
    }

    if (llmResponse.foundedKnowledgeID) {
      this.foundedKnowledgeID = llmResponse.foundedKnowledgeID;
      const path = result.paths.get(llmResponse.foundedKnowledgeID)
      if (path)
        this.pathHistory.push(path)
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

    const result = await llmRequest(PromptCreator.finalize({ query, knowledge, comments }));

    console.log('\nSuccessfully executed. Search answer:\n', result)
    return result
  }

  private async failed() {
    const query = this.state.query;
    const knowledge =
      `Knowledge[NotFound] (После множества безуспешных попыток сработало ограничение поиска)`;
    const comments = this.comments.map((c, i) => `Step ${i + 1}: ${c}`)
      .join("\n");

    const result = await llmRequest(PromptCreator.finalize({ query, knowledge, comments }));
  
    console.log('\nExecution failed. Search answer:\n', result)
    return result;
  }

  public result() {
    if (this.panicMode) return this.failed();

    return this.ok();
  }

  public meta() {
    return {
      paths: this.pathHistory
    }
  }

  private filterNneedToVisit(needToVisit: number[]) {
    return [
      ...this.needToVisitStack,
      ...needToVisit.filter((n) => !this.needToVisitStack.includes(n))
        .reverse(),
    ];
  }
}
