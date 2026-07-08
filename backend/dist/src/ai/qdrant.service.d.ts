import { OnModuleInit } from '@nestjs/common';
export declare class QdrantService implements OnModuleInit {
    private client;
    private readonly collectionName;
    constructor();
    onModuleInit(): Promise<void>;
    upsertVectors(points: any[]): Promise<{
        operation_id?: number | null;
        status: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["UpdateStatus"];
    }>;
    searchVectors(vector: number[], limit?: number): Promise<{
        id: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["ExtendedPointId"];
        version: number;
        score: number;
        payload?: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["Payload"] | (Record<string, unknown> | null);
        vector?: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["VectorStructOutput"] | (Record<string, unknown> | null);
        shard_key?: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["ShardKey"] | (Record<string, unknown> | null);
        order_value?: import("node_modules/@qdrant/js-client-rest/dist/types/openapi/generated_schema.js", { with: { "resolution-mode": "import" } }).components["schemas"]["OrderValue"] | (Record<string, unknown> | null);
    }[]>;
}
