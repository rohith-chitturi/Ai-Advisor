"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAdvisorService = void 0;
const common_1 = require("@nestjs/common");
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
const zod_1 = require("zod");
const meilisearch_service_1 = require("./meilisearch.service");
const qdrant_service_1 = require("./qdrant.service");
let AiAdvisorService = class AiAdvisorService {
    meiliService;
    qdrantService;
    constructor(meiliService, qdrantService) {
        this.meiliService = meiliService;
        this.qdrantService = qdrantService;
    }
    async recommendTools(query, userContext) {
        let vectorResults = [];
        try {
            const { embedding } = await (0, ai_1.embed)({
                model: openai_1.openai.embedding('text-embedding-3-small'),
                value: query,
            });
            vectorResults = await this.qdrantService.searchVectors(embedding, 3);
        }
        catch (e) {
            console.warn('Embedding failed or Qdrant unavailable, proceeding with empty vector results', e);
        }
        const meiliResults = await this.meiliService.search(query, { limit: 3 });
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
            const { object } = await (0, ai_1.generateObject)({
                model: (0, openai_1.openai)('gpt-4o'),
                schema: zod_1.z.object({
                    summary: zod_1.z.string().describe("A brief, friendly summary of the recommendations and how they solve the user's problem."),
                    recommendations: zod_1.z.array(zod_1.z.object({
                        toolName: zod_1.z.string(),
                        slug: zod_1.z.string().describe("The exact slug of the tool from the database context, if available."),
                        whyItFits: zod_1.z.string().describe("A compelling explanation of why this tool is perfect for the user."),
                        pricingModel: zod_1.z.string().optional()
                    }))
                }),
                prompt: prompt,
            });
            return {
                ...object,
                sources: meiliResults.hits
            };
        }
        catch (e) {
            console.error('Error generating AI recommendation', e);
            return {
                summary: 'Unable to generate recommendation at this time. Please browse our tools below.',
                recommendations: [],
                sources: meiliResults.hits
            };
        }
    }
};
exports.AiAdvisorService = AiAdvisorService;
exports.AiAdvisorService = AiAdvisorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [meilisearch_service_1.MeilisearchService,
        qdrant_service_1.QdrantService])
], AiAdvisorService);
//# sourceMappingURL=ai-advisor.service.js.map