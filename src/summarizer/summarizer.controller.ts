import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { SummarizerService } from './summarizer.service';
import { SummarizeDto } from './dto/summarize.dto';

@Controller('summarizer')
export class SummarizerController {
  constructor(private readonly summarizerService: SummarizerService) {}

  // This is our original (mocked) endpoint for creating a summary
  @Post()
  summarize(@Body() body: SummarizeDto, @Headers('authorization') authHeader: string) {
    // The header comes in as "Bearer <token>", so we split it.
    const token = authHeader?.split(' ')[1];
    return this.summarizerService.summarizeAndSave(body, token);
  }

  // This is our NEW endpoint to get all summaries for a user
  @Get()
  getSummaries(@Headers('authorization') authHeader: string) {
    // The header comes in as "Bearer <token>", so we split it.
    const token = authHeader?.split(' ')[1];
    return this.summarizerService.getSummariesForUser(token);
  }
}