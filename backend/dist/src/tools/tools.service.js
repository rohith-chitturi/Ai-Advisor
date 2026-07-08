"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let ToolsService = class ToolsService {
    async getAllTools() {
        return await db_1.db.select().from(schema_1.tools);
    }
    async getToolBySlug(slug) {
        const result = await db_1.db.select().from(schema_1.tools).where((0, drizzle_orm_1.eq)(schema_1.tools.slug, slug));
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException(`Tool with slug ${slug} not found`);
        }
        return result[0];
    }
};
exports.ToolsService = ToolsService;
exports.ToolsService = ToolsService = __decorate([
    (0, common_1.Injectable)()
], ToolsService);
//# sourceMappingURL=tools.service.js.map