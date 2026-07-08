import { ToolsService } from './tools.service';
export declare class ToolsController {
    private readonly toolsService;
    constructor(toolsService: ToolsService);
    getAllTools(): Promise<{
        id: number;
        name: string;
        slug: string;
        description: string;
        logoUrl: string | null;
        websiteUrl: string | null;
        overallScore: number | null;
        pricingType: string | null;
        features: unknown;
        pros: unknown;
        cons: unknown;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTool(slug: string): Promise<{
        id: number;
        name: string;
        slug: string;
        description: string;
        logoUrl: string | null;
        websiteUrl: string | null;
        overallScore: number | null;
        pricingType: string | null;
        features: unknown;
        pros: unknown;
        cons: unknown;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
