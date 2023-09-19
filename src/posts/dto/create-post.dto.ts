import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ICreatePost } from '../interfaces/create-post.interface';

export class CreatePostDTO implements ICreatePost {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  readonly content: string;
}
