// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummarizerModule } from './summarizer/summarizer.module';
import { ConfigModule } from '@nestjs/config'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    SummarizerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}