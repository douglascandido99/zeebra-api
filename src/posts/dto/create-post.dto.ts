import { ICreatePost } from '../interfaces/create-post.interface';

export class CreatePostDTO implements ICreatePost {
  readonly content: string;
}
