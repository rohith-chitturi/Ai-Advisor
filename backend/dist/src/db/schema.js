"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsToCategoriesRelations = exports.categoriesRelations = exports.toolsRelations = exports.toolsToCategories = exports.tools = exports.categories = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    fullName: (0, pg_core_1.varchar)('full_name', { length: 255 }),
    clerkId: (0, pg_core_1.varchar)('clerk_id', { length: 255 }).unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull().unique(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
});
exports.tools = (0, pg_core_1.pgTable)('tools', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)('description').notNull(),
    logoUrl: (0, pg_core_1.varchar)('logo_url', { length: 1024 }),
    websiteUrl: (0, pg_core_1.varchar)('website_url', { length: 1024 }),
    overallScore: (0, pg_core_1.integer)('overall_score'),
    pricingType: (0, pg_core_1.varchar)('pricing_type', { length: 50 }),
    features: (0, pg_core_1.jsonb)('features'),
    pros: (0, pg_core_1.jsonb)('pros'),
    cons: (0, pg_core_1.jsonb)('cons'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.toolsToCategories = (0, pg_core_1.pgTable)('tools_to_categories', {
    toolId: (0, pg_core_1.integer)('tool_id').notNull().references(() => exports.tools.id),
    categoryId: (0, pg_core_1.integer)('category_id').notNull().references(() => exports.categories.id),
});
exports.toolsRelations = (0, drizzle_orm_1.relations)(exports.tools, ({ many }) => ({
    categories: many(exports.toolsToCategories),
}));
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many }) => ({
    tools: many(exports.toolsToCategories),
}));
exports.toolsToCategoriesRelations = (0, drizzle_orm_1.relations)(exports.toolsToCategories, ({ one }) => ({
    tool: one(exports.tools, {
        fields: [exports.toolsToCategories.toolId],
        references: [exports.tools.id],
    }),
    category: one(exports.categories, {
        fields: [exports.toolsToCategories.categoryId],
        references: [exports.categories.id],
    }),
}));
//# sourceMappingURL=schema.js.map