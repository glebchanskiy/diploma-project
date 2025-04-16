import { neoSearch, neoSearchFirst } from "./neo4j/client.ts";
import { sysAsist } from "./prompts.ts";

type State = {
  query: string;
};

export class Context {
  private responseText: string | undefined;

  private visitedNodes: number[] = [];
  private neoText: string | undefined;
  private startNodeId: number | undefined;
  private foundedKnowledgeID: number | undefined

  constructor(
    private callAi: (
      system: string,
      user: string,
    ) => Promise<string | undefined>,
    private state: State,
  ) {
  }

  public async execute() {
    console.log('visitedNodes: ', this.visitedNodes)
    console.log('startNodeId: ', this.startNodeId)
    if (this.visitedNodes.length === 0 || !this.startNodeId) {
      console.log('simple search')
      const { text, visitedNodes } = await neoSearchFirst();
      this.neoText = text;
      this.visitedNodes.push(...visitedNodes);
      
    } else {
      console.log('nested search')
      const { text, visitedNodes } = await neoSearch(
        this.startNodeId,
        this.visitedNodes,
      );
      this.neoText = text;
      this.visitedNodes.push(...visitedNodes);
    }

    // console.log("NeoText: ", this.neoText)
    // console.log("visitedNodes: ", this.visitedNodes)

    this.responseText = await this.callAi(
      sysAsist,
      `QUERY: ${this.state.query}\nKNOWLEDGES:\n${this.neoText}`,
    ).then(t => t?.replace('```json', '')?.replace('```', ''));

    try {
      if (this.responseText) {
        const response = JSON.parse(this.responseText)
        console.log('Parsed: ', response)
        if (response.needToVisit) {
          this.startNodeId = Number(response.needToVisit)
        }
        if (response.foundedKnowledgeID) {
          this.foundedKnowledgeID = Number(response.foundedKnowledgeID)
        }
      }
    } catch (_err) {}

    console.log('Response: ', this.responseText)

    return this;
  }

  public response() {
    return this.responseText;
  }

  public id() {
    return this.foundedKnowledgeID;
  }
}
