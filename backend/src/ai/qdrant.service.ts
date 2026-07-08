import { Injectable, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class QdrantService implements OnModuleInit {
  private client: QdrantClient;
  private readonly collectionName = 'ai_tools';

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
    });
  }

  async onModuleInit() {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === this.collectionName);
      
      if (!exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: { size: 1536, distance: 'Cosine' }, // Assuming OpenAI embeddings
        });
        console.log(`Created Qdrant collection: ${this.collectionName}`);
      } else {
        console.log('Qdrant connected and collection exists.');
      }
    } catch (error) {
      console.error('Error connecting to Qdrant', error);
    }
  }

  async upsertVectors(points: any[]) {
    return await this.client.upsert(this.collectionName, {
      wait: true,
      points,
    });
  }

  async searchVectors(vector: number[], limit: number = 5) {
    return await this.client.search(this.collectionName, {
      vector,
      limit,
    });
  }
}
