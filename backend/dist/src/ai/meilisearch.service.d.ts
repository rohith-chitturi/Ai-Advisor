import { OnModuleInit } from '@nestjs/common';
export declare class MeilisearchService implements OnModuleInit {
    private client;
    private toolsIndex;
    constructor();
    onModuleInit(): Promise<void>;
    addDocuments(documents: any[]): Promise<import("meilisearch", { with: { "resolution-mode": "import" } }).EnqueuedTask>;
    search(query: string, options?: any): Promise<import("meilisearch", { with: { "resolution-mode": "import" } }).SearchResponse<import("meilisearch", { with: { "resolution-mode": "import" } }).RecordAny, any>>;
}
