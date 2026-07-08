import type { Request } from 'express';
export declare class AuthController {
    handleClerkWebhook(req: Request, headers: Record<string, string>): Promise<{
        success: boolean;
    }>;
}
