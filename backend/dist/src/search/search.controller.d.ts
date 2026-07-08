import { AiAdvisorService } from '../ai/ai-advisor.service';
export declare class SearchController {
    private readonly aiService;
    constructor(aiService: AiAdvisorService);
    search(query: string): Promise<{
        recommendation: string;
        sources: import("meilisearch", { with: { "resolution-mode": "import" } }).Hits<import("meilisearch", { with: { "resolution-mode": "import" } }).RecordAny>;
    } | {
        error: string;
    }>;
}
