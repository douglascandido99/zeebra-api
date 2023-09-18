import { Posts } from '@prisma/client';
import { CreatePostDTO } from '../dto/create-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';

export interface IPosts {
  createPost(userId: number, dto: CreatePostDTO): Promise<Posts>;
  getPostById(userId: number, postId: number): Promise<Posts>;
  getAllPosts(userId: number): Promise<Posts[]>;
  updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts>;
  deletePostById(userId: number, postId: number): Promise<{ msg: string }>;
}
