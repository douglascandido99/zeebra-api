import { Posts } from '@prisma/client';
import { CreatePostDTO } from '../dto/create-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';

export interface IPosts {
  createPost(dto: CreatePostDTO): Promise<Posts>;
  getPostById(userId: number, postId: number): Promise<Posts>;
  getAllPosts(userId: number): Promise<Posts[]>;
  getDraftById(userId: number, postId: number): Promise<Posts>;
  getAllDrafts(userId: number): Promise<Posts[]>;
  updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts>;
  deletePostById(userId: number, postId: number): Promise<string>;
  deleteAllPosts(userId: number): Promise<string>;
}
