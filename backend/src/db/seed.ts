import { db } from './db';
import { tools, categories, toolsToCategories } from './schema';

async function seed() {
  console.log('Seeding data...');

  // Seed categories
  const insertedCategories = await db.insert(categories).values([
    { name: 'Language Models', slug: 'language-models', description: 'General purpose large language models' },
    { name: 'Image Generation', slug: 'image-generation', description: 'AI tools that generate images from text' },
    { name: 'Coding Assistants', slug: 'coding-assistants', description: 'AI tools to help write and debug code' },
  ]).returning();

  const [lmCategory, igCategory, codeCategory] = insertedCategories;

  // Seed tools
  const insertedTools = await db.insert(tools).values([
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'OpenAI\'s flagship conversational model.',
      websiteUrl: 'https://chat.openai.com',
      overallScore: 98,
      pricingType: 'FREEMIUM',
      features: { voice: true, vision: true, search: true },
    },
    {
      name: 'Claude',
      slug: 'claude',
      description: 'Anthropic\'s highly capable and safe AI assistant.',
      websiteUrl: 'https://claude.ai',
      overallScore: 97,
      pricingType: 'FREEMIUM',
      features: { vision: true, long_context: true },
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'High quality AI image generation tool.',
      websiteUrl: 'https://midjourney.com',
      overallScore: 95,
      pricingType: 'PAID',
      features: { vision: true, high_resolution: true },
    },
    {
      name: 'Cursor',
      slug: 'cursor',
      description: 'The AI Code Editor built to make you extraordinarily productive.',
      websiteUrl: 'https://cursor.sh',
      overallScore: 96,
      pricingType: 'FREEMIUM',
      features: { codebase_indexing: true, terminal: true },
    }
  ]).returning();

  // Link tools to categories
  const chatgpt = insertedTools.find(t => t.slug === 'chatgpt');
  const claude = insertedTools.find(t => t.slug === 'claude');
  const midjourney = insertedTools.find(t => t.slug === 'midjourney');
  const cursor = insertedTools.find(t => t.slug === 'cursor');

  if (chatgpt && claude && midjourney && cursor) {
    await db.insert(toolsToCategories).values([
      { toolId: chatgpt.id, categoryId: lmCategory.id },
      { toolId: claude.id, categoryId: lmCategory.id },
      { toolId: midjourney.id, categoryId: igCategory.id },
      { toolId: cursor.id, categoryId: codeCategory.id },
    ]);
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
