import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SummarizeDto } from './dto/summarize.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);

@Injectable()
export class SummarizerService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Key must be defined in the .env file');
    }

    console.log(`Backend is connecting to Supabase URL: ${supabaseUrl}`);

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async summarizeAndSave(dto: SummarizeDto, token: string): Promise<any> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication Error:', authError?.message);
      throw new UnauthorizedException('Invalid or missing token');
    }

    const { transcript, title } = await this.fetchTranscriptWithYtDlp(dto.url);
    
    const truncatedTranscript = transcript.substring(0, 1000);
    const summary = await this.summarizeTextWithAI(truncatedTranscript);

    const { data: savedSummary, error: insertError } = await this.supabase
      .from('summaries')
      .insert({
        user_id: user.id,
        video_url: dto.url,
        summary_text: summary,
        video_title: title,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database Insert Error:', insertError.message);
      throw new Error(`Database error: ${insertError.message}`);
    }

    return savedSummary;
  }
  
  async getSummariesForUser(token: string) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication Error:', authError?.message);
      throw new UnauthorizedException('Invalid or missing token');
    }

    const { data: summaries, error } = await this.supabase
      .from('summaries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database Fetch Error:', error.message);
      throw new Error(error.message);
    }
    return summaries;
  }

  // NOTE: The methods below are kept for future enhancement.
  private async performSummarization(transcript: string): Promise<string> {
    const chunks = this.createTextChunks(transcript, 2000, 200);
    const chunkSummaries: string[] = [];
    for (const chunk of chunks) {
      const summary = await this.summarizeTextWithAI(chunk);
      chunkSummaries.push(summary);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const combinedSummary = chunkSummaries.join(' ');
    if (chunks.length > 1) {
      return this.summarizeTextWithAI(
        `Create a final, cohesive summary from the following collection of smaller summaries: ${combinedSummary}`,
      );
    }
    return combinedSummary;
  }
  
  private createTextChunks(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize));
      i += chunkSize - overlap;
    }
    return chunks;
  }

  private async fetchTranscriptWithYtDlp(url: string): Promise<{ transcript: string; title: string }> {
    const baseFilename = `transcript_${Date.now()}`;
    const baseFilepath = path.resolve(baseFilename);
    const finalFilepath = `${baseFilepath}.en.json3`;
    const command = `python -m yt_dlp --write-sub --sub-format json3 --skip-download --sub-langs "en.*" -o "${baseFilepath}" --print-json "${url}"`;
    try {
      const { stdout } = await execAsync(command);
      const videoInfo = JSON.parse(stdout);
      const title = videoInfo.title || 'Untitled Video';
      if (!fs.existsSync(finalFilepath)) {
        throw new Error('Transcript file not found after command execution.');
      }
      const fileContent = fs.readFileSync(finalFilepath, 'utf-8');
      const transcriptData = JSON.parse(fileContent);
      const transcriptText = transcriptData.events
        .map((e: any) => e.segs?.map((s: any) => s.utf8).join(' ') || '')
        .join(' ');
      if (!transcriptText.trim()) throw new Error('Parsed transcript is empty.');
      return { transcript: transcriptText, title: title };
    } catch (error) {
      throw new Error(`Failed to process transcript: ${error.message}`);
    } finally {
      if (fs.existsSync(finalFilepath)) fs.unlinkSync(finalFilepath);
    }
  }

  private async summarizeTextWithAI(text: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { 
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [{ role: 'user', content: `Provide a concise, one-paragraph summary of the following text: ${text}` }] 
      },
      { 
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/sambhav291',
          'X-Title': 'QuickVid AI Summarizer',
        } 
      },
    );
    return response.data.choices[0].message.content;
  }
}
