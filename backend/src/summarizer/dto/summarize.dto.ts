import { IsNotEmpty, IsUrl } from 'class-validator';

export class SummarizeDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
