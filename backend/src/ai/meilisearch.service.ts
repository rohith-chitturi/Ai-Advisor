import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch, Index } from 'meilisearch';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private client: MeiliSearch;
  private toolsIndex: Index;

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_MASTER_KEY || 'ai_advisor_master_key',
    });
  }

  async onModuleInit() {
    this.toolsIndex = this.client.index('tools');
    
    try {
      await this.toolsIndex.updateFilterableAttributes([
        'category',
        'pricingType',
        'overallScore',
      ]);
      await this.toolsIndex.updateSearchableAttributes([
        'name',
        'description',
        'features',
        'pros',
        'cons',
      ]);
      console.log('Meilisearch connected and configured.');
    } catch (error) {
      console.error('Error configuring Meilisearch', error);
    }
  }

  async addDocuments(documents: any[]) {
    return await this.toolsIndex.addDocuments(documents);
  }

  async search(query: string, options?: any) {
    return await this.toolsIndex.search(query, options);
  }
}
