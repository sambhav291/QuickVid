import { Controller, Post, Body, Get, Delete, Param, Headers } from '@nestjs/common';
import { SummarizerService } from './summarizer.service';
import { SummarizeDto, SaveSummaryDto } from './dto/summarize.dto';

@Controller('summarizer')
export class SummarizerController {
  constructor(private readonly summarizerService: SummarizerService) {}

  // This is our original endpoint for creating a summary
  @Post()
  summarize(@Body() body: SummarizeDto, @Headers('authorization') authHeader: string) {
    // The header comes in as "Bearer <token>", so we split it.
    console.log('Auth header received:', authHeader);
    
    // Always return summary without saving (user must explicitly save)
    return this.summarizerService.summarizeOnly(body);
  }

  // NEW endpoint to save a summary
  @Post('save')
  saveSummary(@Body() body: SaveSummaryDto, @Headers('authorization') authHeader: string) {
    console.log('Save summary request - Auth header:', authHeader);
    
    if (!authHeader) {
      throw new Error('Authorization header is missing - must be logged in to save');
    }
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      throw new Error('Bearer token is missing or malformed');
    }
    
    return this.summarizerService.saveEncryptedSummary(body, token);
  }

  // This is our NEW endpoint to get all summaries for a user
  @Get()
  getSummaries(@Headers('authorization') authHeader: string) {
    // The header comes in as "Bearer <token>", so we split it.
    console.log('Auth header received:', authHeader);
    
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    
    const token = authHeader?.split(' ')[1];
    console.log('Extracted token:', token);
    
    if (!token) {
      throw new Error('Bearer token is missing or malformed');
    }
    
    return this.summarizerService.getSummariesForUser(token);
  }

  // DELETE endpoint to delete a summary by ID
  @Delete(':id')
  deleteSummary(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    console.log('Delete request for summary ID:', id);
    
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      throw new Error('Bearer token is missing or malformed');
    }
    
    return this.summarizerService.deleteSummary(id, token);
  }
}