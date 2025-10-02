import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SummarizerController } from './summarizer.controller';
import { SummarizerService } from './summarizer.service';

@Module({
  imports: [ConfigModule],
  controllers: [SummarizerController],
  providers: [SummarizerService]
})
export class SummarizerModule {}
