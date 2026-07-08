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
        const mockEmbedding = Array(1536).fill(0.1);
        const vectorResults = await this.qdrantService.searchVectors(mockEmbedding, 3);
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

      Please recommend the best tools for the user, explaining why each tool fits their specific needs.
      Format the response beautifully.
    `;
        try {
            const { text } = await (0, ai_1.generateText)({
                model: (0, openai_1.openai)('gpt-4o'),
                prompt: prompt,
            });
            return {
                recommendation: text,
                sources: meiliResults.hits
            };
        }
        catch (e) {
            console.error('Error generating AI recommendation', e);
            return {
                recommendation: 'Unable to generate recommendation at this time.',
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