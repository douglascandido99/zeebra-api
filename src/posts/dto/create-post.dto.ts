import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  readonly content: string;

  @IsOptional()
  @IsString()
  readonly media?: string;
}
