import { Injectable } from '@nestjs/common';
import { generateObject, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { MeilisearchService } from './meilisearch.service';
import { QdrantService } from './qdrant.service';

@Injectable()
export class AiAdvisorService {
  constructor(
    private readonly meiliService: MeilisearchService,
    private readonly qdrantService: QdrantService
  ) {}

  async recommendTools(query: string, userContext: any) {
    // 1. Semantic Search using Qdrant with actual embeddings
    let vectorResults: any[] = [];
    try {
      const { embedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: query,
      });
      vectorResults = await this.qdrantService.searchVectors(embedding, 3);
    } catch (e) {
      console.warn('Embedding failed or Qdrant unavailable, proceeding with empty vector results', e);
    }

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

      Please recommend the best tools for the user. Focus on exact matches from the provided database context if they fit well. Explain clearly why each tool fits their specific needs.
    `;

    try {
      const { object } = await generateObject({
        model: google('gemini-1.5-flash'),
        schema: z.object({
          summary: z.string().describe("A brief, friendly summary of the recommendations and how they solve the user's problem."),
          recommendations: z.array(z.object({
            toolName: z.string(),
            slug: z.string().describe("The exact slug of the tool from the database context, if available."),
            whyItFits: z.string().describe("A compelling explanation of why this tool is perfect for the user."),
            pricingModel: z.string().nullable()
          }))
        }),
        prompt: prompt,
      });

      return {
        ...object,
        sources: meiliResults.hits
      };
    } catch (e) {
      console.error('Error generating AI recommendation', e);
      return {
        summary: 'Unable to generate recommendation at this time. Please browse our tools below.',
        recommendations: [],
        sources: meiliResults.hits
      };
    }
  }
}
