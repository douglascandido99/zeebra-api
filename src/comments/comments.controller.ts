import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Comments } from '@prisma/client';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('posts/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create')
  async createComment(
    @Param('id') postId: string,
    @Body() dto: CreateCommentDTO,
    @GetUser('id', ParseIntPipe) userId: number,
  ): Promise<Comments> {
    return await this.commentsService.createComment(postId, dto, userId);
  }

  @Get(':commentId')
  async getCommentById(
    @Param('id') postId: string,
    @Param('commentId', ParseIntPipe)
    id: number,
  ): Promise<Comments> {
    return await this.commentsService.getCommentById(postId, id);
  }

  @Get()
  async getAllCommentsByPostId(
    @Param('id') postId: string,
  ): Promise<Comments[]> {
    return await this.commentsService.getAllCommentsByPostId(postId);
  }

  @Patch(':commentId')
  async updateComment(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id') postId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDTO,
  ): Promise<Comments> {
    return await this.commentsService.updateComment(
      userId,
      postId,
      commentId,
      dto,
    );
  }

  @Delete(':commentId')
  async deletePost(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id') postId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<MessageResponse> {
    return await this.commentsService.deleteComment(userId, postId, commentId);
  }
}
