import { Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { MeilisearchService } from './meilisearch.service';
import { QdrantService } from './qdrant.service';

@Injectable()
export class AiAdvisorService {
  constructor(
    private readonly meiliService: MeilisearchService,
    private readonly qdrantService: QdrantService
  ) {}

  async recommendTools(query: string, userContext: any) {
    // 1. Semantic Search using Qdrant (mocked embedding for now)
    // In production, we'd embed the query using OpenAI embeddings first
    const mockEmbedding = Array(1536).fill(0.1); 
    const vectorResults = await this.qdrantService.searchVectors(mockEmbedding, 3);

    // 2. Exact/Text Search using Meilisearch
    const meiliResults = await this.meiliService.search(query, { limit: 3 });

    // 3. Combine contexts and ask LLM to synthesize recommendation
    const toolsContext = JSON.stringify({
      vectorResults: vectorResults,
      textResults: meiliResults.hits,
    });

    const prompt = `
      You are an expert AI Advisor. A user is asking: "${query}".
      Their context is: ${JSON.stringify(userContext)}.
      
      Here are some highly relevant AI tools from our database:
      ${toolsContext}

      Please recommend the best tools for the user, explaining why each tool fits their specific needs.
      Format the response beautifully.
    `;

    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt: prompt,
      });

      return {
        recommendation: text,
        sources: meiliResults.hits
      };
    } catch (e) {
      console.error('Error generating AI recommendation', e);
      return {
        recommendation: 'Unable to generate recommendation at this time.',
        sources: meiliResults.hits
      };
    }
  }
}
