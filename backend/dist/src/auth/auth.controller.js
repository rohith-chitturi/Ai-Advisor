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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const svix_1 = require("svix");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let AuthController = class AuthController {
    async handleClerkWebhook(req, headers) {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
        }
        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];
        if (!svix_id || !svix_timestamp || !svix_signature) {
            throw new common_1.BadRequestException('Error occured -- no svix headers');
        }
        const payload = req.body;
        const body = JSON.stringify(payload);
        const wh = new svix_1.Webhook(WEBHOOK_SECRET);
        let evt;
        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        }
        catch (err) {
            console.error('Error verifying webhook:', err);
            throw new common_1.BadRequestException('Error occured');
        }
        const { id } = evt.data;
        const eventType = evt.type;
        if (eventType === 'user.created') {
            const email = evt.data.email_addresses[0]?.email_address;
            const firstName = evt.data.first_name || '';
            const lastName = evt.data.last_name || '';
            console.log(`Webhook triggered: new user created with ID ${id} and email ${email}`);
            await db_1.db.insert(schema_1.users).values({
                clerkId: id,
                email: email,
                fullName: `${firstName} ${lastName}`.trim() || null,
            }).onConflictDoNothing();
        }
        if (eventType === 'user.updated') {
            const email = evt.data.email_addresses[0]?.email_address;
            const firstName = evt.data.first_name || '';
            const lastName = evt.data.last_name || '';
            await db_1.db.update(schema_1.users)
                .set({
                email: email,
                fullName: `${firstName} ${lastName}`.trim() || null,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, id));
        }
        if (eventType === 'user.deleted') {
            await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, id));
        }
        return { success: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleClerkWebhook", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth')
], AuthController);
//# sourceMappingURL=auth.controller.js.map