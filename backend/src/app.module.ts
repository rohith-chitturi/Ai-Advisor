import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsController } from './tools/tools.controller';
import { ToolsService } from './tools/tools.service';
import { SearchController } from './search/search.controller';
import { AiAdvisorService } from './ai/ai-advisor.service';
import { MeilisearchService } from './ai/meilisearch.service';
import { QdrantService } from './ai/qdrant.service';
@Module({
  imports: [],
  controllers: [AppController, ToolsController, SearchController],
  providers: [AppService, ToolsService, AiAdvisorService, MeilisearchService, QdrantService],
})
export class AppModule {}
