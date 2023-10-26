import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from 'src/posts/repository/posts.repository';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentsRepository } from './repository/comments.repository';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';
import { Comments } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly posts: PostsRepository,
    private readonly comments: CommentsRepository,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDTO,
    userId: number,
  ): Promise<Comments> {
    const post = await this.posts.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const data = { postId, ...dto, userId };
    try {
      return await this.comments.createComment(data);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async getCommentById(postId: string, id: number): Promise<Comments> {
    const post = await this.posts.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.comments.getCommentById(id);
    if (!comment || comment.postId !== postId)
      throw new NotFoundException('Comment not found');
    try {
      return comment;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get comment');
    }
  }

  async getAllCommentsByPostId(postId: string): Promise<Comments[]> {
    const post = await this.posts.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const comments = await this.comments.getAllCommentsFromPostId(postId);
    if (comments.length === 0) throw new NotFoundException('No comments found');
    try {
      return comments;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get comments');
    }
  }

  async updateComment(
    userId: number,
    postId: string,
    commentId: number,
    dto: UpdateCommentDTO,
  ): Promise<Comments> {
    const post = await this.posts.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.comments.getCommentById(commentId);
    if (!comment || comment.postId !== postId)
      throw new NotFoundException('Comment not found');

    if (comment.userId !== userId)
      throw new ForbiddenException('Access denied');

    try {
      return await this.comments.updateComment(commentId, dto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update comment');
    }
  }

  async deleteComment(
    userId: number,
    postId: string,
    commentId: number,
  ): Promise<MessageResponse> {
    const post = await this.posts.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.comments.getCommentById(commentId);
    if (!comment || comment.postId !== postId)
      throw new NotFoundException('Comment not found');

    if (comment.userId !== userId)
      throw new ForbiddenException('Access denied');

    try {
      await this.comments.deleteComment(commentId);
      return { msg: 'Comment deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
