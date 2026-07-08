"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const schema_1 = require("./schema");
const ai_1 = require("ai");
const google_1 = require("@ai-sdk/google");
const js_client_rest_1 = require("@qdrant/js-client-rest");
const meilisearch_1 = require("meilisearch");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const qdrantClient = new js_client_rest_1.QdrantClient({ url: process.env.QDRANT_URL || 'http://localhost:6333' });
const meiliClient = new meilisearch_1.Meilisearch({
    host: process.env.MEILI_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILI_MASTER_KEY || 'ai_advisor_master_key',
});
async function seed() {
    console.log('🌱 Starting comprehensive data seed...');
    console.log('Clearing existing data...');
    await db_1.db.delete(schema_1.toolsToCategories);
    await db_1.db.delete(schema_1.tools);
    await db_1.db.delete(schema_1.categories);
    try {
        await meiliClient.index('tools').deleteAllDocuments();
    }
    catch (e) {
        console.warn('Meilisearch index may not exist yet.');
    }
    try {
        await qdrantClient.deleteCollection('tools');
    }
    catch (e) {
        console.warn('Qdrant collection may not exist yet.');
    }
    await qdrantClient.createCollection('tools', {
        vectors: { size: 1536, distance: 'Cosine' },
    });
    const insertedCategories = await db_1.db.insert(schema_1.categories).values([
        { name: 'Language Models', slug: 'language-models', description: 'General purpose large language models for chat and generation' },
        { name: 'Image Generation', slug: 'image-generation', description: 'AI tools that generate or edit images from text' },
        { name: 'Coding Assistants', slug: 'coding-assistants', description: 'AI tools to help write, refactor, and debug code' },
        { name: 'Video Generation', slug: 'video-generation', description: 'AI tools for creating and editing video content' },
        { name: 'Productivity', slug: 'productivity', description: 'AI tools to boost daily workflow, writing, and organization' },
    ]).returning();
    const catMap = insertedCategories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {});
    const toolData = [
        { catSlug: 'language-models', tool: { name: 'ChatGPT', slug: 'chatgpt', description: 'OpenAI flagship model with reasoning capabilities.', websiteUrl: 'https://chat.openai.com', overallScore: 98, pricingType: 'FREEMIUM', features: { reasoning: true, plugins: true }, pros: ['Extremely versatile', 'Voice mode is incredible'], cons: ['Usage limits on pro'] } },
        { catSlug: 'language-models', tool: { name: 'Claude', slug: 'claude', description: 'Anthropic AI assistant focusing on safety and massive context windows.', websiteUrl: 'https://claude.ai', overallScore: 97, pricingType: 'FREEMIUM', features: { large_context: true, artifacts: true }, pros: ['Amazing writer', 'Huge context window'], cons: ['Strict safety filters'] } },
        { catSlug: 'language-models', tool: { name: 'Gemini', slug: 'gemini', description: 'Google natively multimodal AI model.', websiteUrl: 'https://gemini.google.com', overallScore: 94, pricingType: 'FREEMIUM', features: { multimodal: true, integration: true }, pros: ['Workspace integration', 'Fast'], cons: ['Can hallucinate facts'] } },
        { catSlug: 'language-models', tool: { name: 'Perplexity AI', slug: 'perplexity', description: 'AI search engine that provides cited answers to queries.', websiteUrl: 'https://perplexity.ai', overallScore: 96, pricingType: 'FREEMIUM', features: { web_search: true, citations: true }, pros: ['Accurate citations', 'Fast research'], cons: ['Not meant for creative writing'] } },
        { catSlug: 'image-generation', tool: { name: 'Midjourney', slug: 'midjourney', description: 'Highest quality AI image generation tool running via Discord.', websiteUrl: 'https://midjourney.com', overallScore: 98, pricingType: 'PAID', features: { photorealism: true, stylized: true }, pros: ['Incredible aesthetics', 'Highly detailed'], cons: ['Requires Discord', 'No free tier'] } },
        { catSlug: 'image-generation', tool: { name: 'DALL-E 3', slug: 'dalle-3', description: 'OpenAI image generator built into ChatGPT.', websiteUrl: 'https://chat.openai.com', overallScore: 92, pricingType: 'PAID', features: { text_in_image: true, prompt_following: true }, pros: ['Follows prompts exactly', 'Generates readable text'], cons: ['Images can look overly "AI"'] } },
        { catSlug: 'image-generation', tool: { name: 'Stable Diffusion', slug: 'stable-diffusion', description: 'Open source image generation model you can run locally.', websiteUrl: 'https://stability.ai', overallScore: 95, pricingType: 'FREE', features: { open_source: true, custom_models: true }, pros: ['Totally free', 'Uncensored', 'Custom LoRAs'], cons: ['Hard to set up locally', 'Needs good GPU'] } },
        { catSlug: 'image-generation', tool: { name: 'Leonardo AI', slug: 'leonardo-ai', description: 'Powerful web-based image generation suite for game assets and art.', websiteUrl: 'https://leonardo.ai', overallScore: 93, pricingType: 'FREEMIUM', features: { custom_models: true, canvas: true }, pros: ['Great interface', 'Free daily tokens'], cons: ['Complex for beginners'] } },
        { catSlug: 'coding-assistants', tool: { name: 'Cursor', slug: 'cursor', description: 'The AI Code Editor built as a fork of VS Code.', websiteUrl: 'https://cursor.sh', overallScore: 98, pricingType: 'FREEMIUM', features: { codebase_context: true, composer: true }, pros: ['Incredible multi-file editing', 'Drop-in VS Code replacement'], cons: ['Indexing can be slow on huge repos'] } },
        { catSlug: 'coding-assistants', tool: { name: 'GitHub Copilot', slug: 'github-copilot', description: 'The original AI pair programmer integrated into IDEs.', websiteUrl: 'https://github.com/features/copilot', overallScore: 95, pricingType: 'PAID', features: { autocomplete: true, chat: true }, pros: ['Huge ecosystem', 'Fast autocomplete'], cons: ['Chat is not as context-aware as Cursor'] } },
        { catSlug: 'coding-assistants', tool: { name: 'V0 by Vercel', slug: 'v0', description: 'Generative UI tool that creates React and Tailwind components.', websiteUrl: 'https://v0.dev', overallScore: 94, pricingType: 'FREEMIUM', features: { react: true, tailwind: true }, pros: ['Instant UI generation', 'Looks beautiful by default'], cons: ['Only does UI, not logic'] } },
        { catSlug: 'coding-assistants', tool: { name: 'Codeium', slug: 'codeium', description: 'Free AI code completion tool.', websiteUrl: 'https://codeium.com', overallScore: 92, pricingType: 'FREE', features: { autocomplete: true, chat: true }, pros: ['Generous free tier', 'Good latency'], cons: ['Slightly less accurate than Copilot'] } },
        { catSlug: 'video-generation', tool: { name: 'Synthesia', slug: 'synthesia', description: 'Create professional videos with AI avatars.', websiteUrl: 'https://synthesia.io', overallScore: 93, pricingType: 'PAID', features: { avatars: true, tts: true }, pros: ['Lifelike avatars', 'Great for training videos'], cons: ['Expensive', 'Avatars lack intense emotion'] } },
        { catSlug: 'video-generation', tool: { name: 'Runway Gen-2', slug: 'runway', description: 'Multimodal AI system that can generate novel videos from text or images.', websiteUrl: 'https://runwayml.com', overallScore: 94, pricingType: 'FREEMIUM', features: { text_to_video: true, image_to_video: true }, pros: ['State of the art generation', 'Web based editor'], cons: ['Outputs can be chaotic/morphing'] } },
        { catSlug: 'video-generation', tool: { name: 'Sora', slug: 'sora', description: 'OpenAI upcoming hyper-realistic text-to-video model.', websiteUrl: 'https://openai.com/sora', overallScore: 99, pricingType: 'PAID', features: { hyper_realistic: true, long_duration: true }, pros: ['Unmatched quality', 'Physics understanding'], cons: ['Limited availability currently'] } },
        { catSlug: 'video-generation', tool: { name: 'HeyGen', slug: 'heygen', description: 'AI video generation platform for marketing and sales.', websiteUrl: 'https://heygen.com', overallScore: 92, pricingType: 'FREEMIUM', features: { avatars: true, voice_clone: true }, pros: ['Excellent voice cloning', 'Fast generation'], cons: ['Credits burn quickly'] } },
        { catSlug: 'productivity', tool: { name: 'Notion AI', slug: 'notion-ai', description: 'AI assistant integrated directly into your Notion workspace.', websiteUrl: 'https://notion.so/product/ai', overallScore: 94, pricingType: 'PAID', features: { writing: true, summarization: true }, pros: ['Seamless integration', 'Great for team wikis'], cons: ['Costs extra on top of Notion plan'] } },
        { catSlug: 'productivity', tool: { name: 'Jasper', slug: 'jasper', description: 'Enterprise AI marketing co-pilot for writing copy.', websiteUrl: 'https://jasper.ai', overallScore: 91, pricingType: 'PAID', features: { marketing_copy: true, brand_voice: true }, pros: ['Custom brand voice', 'SEO integrations'], cons: ['Expensive for solo users'] } },
        { catSlug: 'productivity', tool: { name: 'Otter.ai', slug: 'otter', description: 'AI meeting assistant that records, transcribes, and summarizes.', websiteUrl: 'https://otter.ai', overallScore: 93, pricingType: 'FREEMIUM', features: { transcription: true, meeting_notes: true }, pros: ['Accurate transcription', 'Auto-joins meetings'], cons: ['Can be intrusive in external meetings'] } },
        { catSlug: 'productivity', tool: { name: 'Grammarly GO', slug: 'grammarly', description: 'AI writing assistance across all your apps.', websiteUrl: 'https://grammarly.com', overallScore: 92, pricingType: 'FREEMIUM', features: { grammar: true, tone_rewrite: true }, pros: ['Works everywhere', 'Reliable corrections'], cons: ['Can over-sanitize writing voice'] } },
    ];
    console.log('Inserting tools into Postgres...');
    const insertedTools = await db_1.db.insert(schema_1.tools).values(toolData.map(t => t.tool)).returning();
    const toolCategoryRelations = insertedTools.map((insertedTool, idx) => {
        return {
            toolId: insertedTool.id,
            categoryId: catMap[toolData[idx].catSlug],
        };
    });
    await db_1.db.insert(schema_1.toolsToCategories).values(toolCategoryRelations);
    console.log('Indexing tools into Qdrant & Meilisearch...');
    const qdrantPoints = [];
    const meiliDocuments = [];
    for (let i = 0; i < insertedTools.length; i++) {
        const t = insertedTools[i];
        const categoryName = toolData[i].catSlug;
        meiliDocuments.push({
            id: t.id,
            toolName: t.name,
            slug: t.slug,
            description: t.description,
            category: categoryName,
            pricingModel: t.pricingType
        });
        const searchContext = `${t.name} - ${categoryName}. ${t.description}. Features: ${JSON.stringify(t.features)}. Pros: ${JSON.stringify(t.pros)}.`;
        try {
            const { embedding } = await (0, ai_1.embed)({
                model: google_1.google.textEmbeddingModel('text-embedding-004'),
                value: searchContext,
            });
            qdrantPoints.push({
                id: t.id,
                vector: embedding,
                payload: {
                    slug: t.slug,
                    name: t.name,
                    category: categoryName,
                    description: t.description
                }
            });
            console.log(`Generated embedding for ${t.name}`);
        }
        catch (e) {
            console.error(`Failed to embed ${t.name}`, e);
        }
    }
    if (meiliDocuments.length > 0) {
        await meiliClient.index('tools').addDocuments(meiliDocuments);
        console.log('Pushed to Meilisearch!');
    }
    if (qdrantPoints.length > 0) {
        await qdrantClient.upsert('tools', {
            wait: true,
            points: qdrantPoints,
        });
        console.log('Pushed to Qdrant!');
    }
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
}
seed().catch((err) => {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map