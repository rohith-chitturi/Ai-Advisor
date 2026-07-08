import { MeilisearchService } from './meilisearch.service';
import { QdrantService } from './qdrant.service';
export declare class AiAdvisorService {
    private readonly meiliService;
    private readonly qdrantService;
    constructor(meiliService: MeilisearchService, qdrantService: QdrantService);
    recommendTools(query: string, userContext: any): Promise<{
        sources: import("meilisearch", { with: { "resolution-mode": "import" } }).Hits<import("meilisearch", { with: { "resolution-mode": "import" } }).RecordAny>;
        summary: string;
        recommendations: {
            toolName: string;
            slug: string;
            whyItFits: string;
            pricingModel: string | null;
        }[];
    }>;
}
