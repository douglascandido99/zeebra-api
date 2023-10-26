import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDTO } from './create-comment.dto';

export class UpdateCommentDTO extends PartialType(CreateCommentDTO) {
  readonly content?: string;
  readonly media?: string;
}
