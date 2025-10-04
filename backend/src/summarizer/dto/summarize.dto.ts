import { IsNotEmpty, IsUrl, IsString } from 'class-validator';

export class SummarizeDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class SaveSummaryDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  encrypted_summary: string;

  @IsNotEmpty()
  @IsString()
  encrypted_title: string;
}
