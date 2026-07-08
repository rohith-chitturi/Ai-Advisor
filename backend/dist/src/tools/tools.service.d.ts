export declare class ToolsService {
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
    getToolBySlug(slug: string): Promise<{
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
