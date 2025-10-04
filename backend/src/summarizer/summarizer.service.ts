import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SummarizeDto } from './dto/summarize.dto';
import axios from 'axios';
import { Innertube } from 'youtubei.js';

@Injectable()
export class SummarizerService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in the .env file');
    }

    // Standard initialization for server-side operations using the service_role key
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async summarizeAndSave(dto: SummarizeDto, token: string): Promise<any> {
    console.log('Service received token:', token);
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length);
    
    // Use the admin client to get the user from the token
    const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
    
    console.log('Supabase auth response:', { user: user?.id, error: authError?.message });
    
    if (authError || !user) {
      console.error('Authentication Error:', authError?.message);
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Fetch transcript using youtube-transcript package
    const { transcript, title } = await this.fetchTranscript(dto.url);
    const summary = await this.summarizeTextWithAI(transcript);

    // Use the admin client for write operations
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

  async summarizeOnly(dto: SummarizeDto): Promise<any> {
    console.log('Anonymous summarization request for:', dto.url);
    
    // Fetch transcript using youtube-transcript package
    const { transcript, title } = await this.fetchTranscript(dto.url);
    const summary = await this.summarizeTextWithAI(transcript);

    // Return summary without saving to database
    return {
      video_url: dto.url,
      summary_text: summary,
      video_title: title,
      saved: false,
    };
  }
  
  async getSummariesForUser(token: string) {
    console.log('getSummariesForUser - Service received token:', token);
    console.log('getSummariesForUser - Token type:', typeof token);
    console.log('getSummariesForUser - Token length:', token?.length);
    
    // Use the admin client to get the user from the token
    const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);

    console.log('getSummariesForUser - Supabase auth response:', { user: user?.id, error: authError?.message });

    if (authError || !user) {
      console.error('getSummariesForUser - Authentication Error:', authError?.message);
      throw new UnauthorizedException('Invalid or missing token');
    }
    
    // Use the admin client for read operations
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

  async deleteSummary(id: string, token: string) {
    console.log('deleteSummary - Service received ID:', id);
    console.log('deleteSummary - Token:', token);
    
    // Use the admin client to get the user from the token
    const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('deleteSummary - Authentication Error:', authError?.message);
      throw new UnauthorizedException('Invalid or missing token');
    }
    
    // Delete the summary - ensure it belongs to the user
    const { error: deleteError } = await this.supabase
      .from('summaries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Security: only delete if it belongs to this user

    if (deleteError) {
      console.error('Delete Error:', deleteError.message);
      throw new Error(`Failed to delete summary: ${deleteError.message}`);
    }
    
    return { success: true, message: 'Summary deleted successfully' };
  }

  // Fetch transcript using YouTubei.js (more reliable, no API key needed)
  private async fetchTranscript(url: string): Promise<{ transcript: string; title: string }> {
    try {
      const videoId = this.extractVideoId(url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      console.log('Fetching transcript for video ID:', videoId);
      
      // Initialize Innertube
      const youtube = await Innertube.create();
      
      // Get video info
      const videoInfo = await youtube.getInfo(videoId);
      
      const title = videoInfo.basic_info.title || 'Untitled Video';
      console.log('Video title:', title);
      
      // Get transcript
      const transcriptData = await videoInfo.getTranscript();
      
      if (!transcriptData || !transcriptData.transcript) {
        throw new Error('No captions/subtitles available for this video. Please try a video with captions enabled.');
      }
      
      // Safely extract text from transcript segments
      const content = transcriptData.transcript.content;
      if (!content || !content.body || !content.body.initial_segments) {
        throw new Error('Transcript structure is missing or malformed. This video may not have captions/subtitles available.');
      }
      const transcript = content.body.initial_segments
        .map((segment: any) => segment.snippet.text)
        .join(' ');
      
      console.log('Transcript extracted. Length:', transcript.length, 'First 100 chars:', transcript.substring(0, 100));
      
      if (!transcript.trim()) {
        throw new Error('Transcript is empty. This video may not have captions/subtitles available.');
      }
      
      return { transcript, title };
    } catch (error) {
      console.error('Transcript fetch error:', error);
      
      // Provide helpful error message
      if (error.message?.includes('Transcript is disabled') || error.message?.includes('No captions')) {
        throw new Error('This video does not have captions/subtitles available. Please try a different video with captions enabled.');
      }
      
      throw new Error(`Failed to fetch transcript: ${error.message || 'Unknown error'}`);
    }
  }

  private extractVideoId(url: string): string {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return '';
  }

  private async summarizeTextWithAI(text: string): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the .env file');
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Define chunk size (roughly 15,000 characters per chunk to stay within token limits)
    const CHUNK_SIZE = 15000;
    const textLength = text.length;

    console.log(`Total transcript length: ${textLength} characters`);

    // If text is small enough, summarize in one go
    if (textLength <= CHUNK_SIZE) {
      console.log('Transcript is short enough, summarizing in one request...');
      return await this.callGeminiAPI(apiUrl, text, false);
    }

    // For long transcripts, chunk and summarize
    console.log('Transcript is long, using chunking strategy...');
    const chunks = this.chunkText(text, CHUNK_SIZE);
    console.log(`Split into ${chunks.length} chunks`);

    // Summarize each chunk
    const chunkSummaries: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Summarizing chunk ${i + 1}/${chunks.length}...`);
      const chunkSummary = await this.callGeminiAPI(apiUrl, chunks[i], true);
      chunkSummaries.push(chunkSummary);
    }

    // Combine all chunk summaries
    const combinedSummaries = chunkSummaries.join('\n\n');
    console.log(`Combined summaries length: ${combinedSummaries.length} characters`);

    // If combined summaries are still too long, summarize again
    if (combinedSummaries.length > CHUNK_SIZE) {
      console.log('Combined summaries are long, doing final summarization...');
      return await this.callGeminiAPI(apiUrl, combinedSummaries, false);
    }

    // Otherwise, do a final summary of the combined summaries
    console.log('Creating final comprehensive summary...');
    return await this.callGeminiAPI(apiUrl, combinedSummaries, false);
  }

  // Helper method to chunk text into smaller pieces
  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + chunkSize;
      
      // If not the last chunk, try to break at a sentence boundary
      if (endIndex < text.length) {
        const lastPeriod = text.lastIndexOf('.', endIndex);
        const lastQuestion = text.lastIndexOf('?', endIndex);
        const lastExclamation = text.lastIndexOf('!', endIndex);
        
        const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);
        
        // Only break at sentence boundary if it's not too far back
        if (breakPoint > startIndex + chunkSize * 0.8) {
          endIndex = breakPoint + 1;
        }
      }

      chunks.push(text.substring(startIndex, endIndex));
      startIndex = endIndex;
    }

    return chunks;
  }

  // Helper method to call Gemini API with appropriate prompts
  private async callGeminiAPI(apiUrl: string, text: string, isChunk: boolean): Promise<string> {
    let prompt: string;

    if (isChunk) {
      // Prompt for individual chunks - keep it concise
      prompt = `Summarize the following part of a video transcript. Focus on the main points and key information:\n\n${text}`;
    } else {
      // Prompt for final summary - make it user-friendly and comprehensive with TL;DR
      prompt = `Create a comprehensive, user-friendly summary of the following video transcript.

Requirements:
- START with a "**TL;DR (Too Long; Didn't Read):**" section with 2-3 sentences capturing the core message
- Then provide a detailed summary below with:
  * Clear bullet points or numbered lists for main ideas
  * Organize content into logical sections with headings if applicable
  * Highlight key points, important facts, and takeaways
  * Make it visually easy to read and scan
  * Be thorough but avoid unnecessary details
  * Use markdown formatting for better readability

Transcript:
${text}`;
    }

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    try {
      const response = await axios.post(apiUrl, payload);
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error from Gemini API:", error.response?.data || error.message);
      throw new Error("Failed to get summary from Gemini API.");
    }
  }
}


