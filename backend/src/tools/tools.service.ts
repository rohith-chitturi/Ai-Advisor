import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { tools } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ToolsService {
  async getAllTools() {
    return await db.select().from(tools);
  }

  async getToolBySlug(slug: string) {
    const result = await db.select().from(tools).where(eq(tools.slug, slug));
    
    if (!result || result.length === 0) {
      throw new NotFoundException(`Tool with slug ${slug} not found`);
    }
    
    return result[0];
  }
}
