import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  clerkId: varchar('clerk_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
});

export const tools = pgTable('tools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  logoUrl: varchar('logo_url', { length: 1024 }),
  websiteUrl: varchar('website_url', { length: 1024 }),
  overallScore: integer('overall_score'),
  pricingType: varchar('pricing_type', { length: 50 }),
  features: jsonb('features'),
  pros: jsonb('pros'),
  cons: jsonb('cons'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const toolsToCategories = pgTable('tools_to_categories', {
  toolId: integer('tool_id').notNull().references(() => tools.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
});

export const toolsRelations = relations(tools, ({ many }) => ({
  categories: many(toolsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tools: many(toolsToCategories),
}));

export const toolsToCategoriesRelations = relations(toolsToCategories, ({ one }) => ({
  tool: one(tools, {
    fields: [toolsToCategories.toolId],
    references: [tools.id],
  }),
  category: one(categories, {
    fields: [toolsToCategories.categoryId],
    references: [categories.id],
  }),
}));
