import { Controller, Get, Query } from '@nestjs/common';
import { AiAdvisorService } from '../ai/ai-advisor.service';

@Controller('search')
export class SearchController {
  constructor(private readonly aiService: AiAdvisorService) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query) {
      return { error: 'Query parameter "q" is required' };
    }
    
    // In a real scenario, pass actual user context here
    const userContext = { role: 'developer', budget: 'freemium' };
    
    return this.aiService.recommendTools(query, userContext);
  }
}
