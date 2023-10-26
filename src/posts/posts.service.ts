import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './repository/posts.repository';
import { CreatePostDTO } from './dto/create-post.dto';
import { Posts } from '@prisma/client';
import { UpdatePostDTO } from './dto/update-post.dto';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';

@Injectable()
export class PostsService {
  constructor(private readonly posts: PostsRepository) {}

  async createPost(dto: CreatePostDTO, userId: number): Promise<Posts> {
    const data = { ...dto, userId };
    try {
      return await this.posts.createPost(data);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async getPostById(id: string): Promise<Posts> {
    const post = await this.posts.getPostById(id);

    if (!post) throw new NotFoundException('Post not found');
    try {
      return post;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get post');
    }
  }

  async getAllPostsByUserId(userId: number): Promise<Posts[]> {
    const posts = await this.posts.getAllPostsByUserId(userId);
    if (posts.length === 0) throw new NotFoundException('No posts found');
    try {
      return posts;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get posts');
    }
  }

  async updatePost(
    dto: UpdatePostDTO,
    id: string,
    userId: number,
  ): Promise<Posts | null> {
    const post = await this.posts.getPostById(id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId) throw new ForbiddenException('Access denied');
    try {
      return await this.posts.updatePost(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async deletePost(userId: number, id: string): Promise<MessageResponse> {
    const post = await this.posts.getPostById(id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId) throw new ForbiddenException('Access denied');
    try {
      await this.posts.deletePost(id);

      return { msg: 'Post deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
