import { AiAdvisorService } from '../ai/ai-advisor.service';
export declare class SearchController {
    private readonly aiService;
    constructor(aiService: AiAdvisorService);
    search(query: string): Promise<{
        sources: import("meilisearch", { with: { "resolution-mode": "import" } }).Hits<import("meilisearch", { with: { "resolution-mode": "import" } }).RecordAny>;
        summary: string;
        recommendations: {
            toolName: string;
            slug: string;
            whyItFits: string;
            pricingModel: string | null;
        }[];
    } | {
        error: string;
    }>;
}
