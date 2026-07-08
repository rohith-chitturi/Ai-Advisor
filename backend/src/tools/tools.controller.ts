import { Controller, Get, Param } from '@nestjs/common';
import { ToolsService } from './tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  async getAllTools() {
    return this.toolsService.getAllTools();
  }

  @Get(':slug')
  async getTool(@Param('slug') slug: string) {
    return this.toolsService.getToolBySlug(slug);
  }
}
