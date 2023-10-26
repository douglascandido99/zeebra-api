import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDTO } from 'src/posts/dto/create-post.dto';

export class CreateCommentDTO extends PartialType(CreatePostDTO) {
  readonly content: string;
  readonly media?: string;
}
