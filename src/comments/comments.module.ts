import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsRepository } from 'src/posts/repository/posts.repository';
import { CommentsRepository } from './repository/comments.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    PostsRepository,
    CommentsRepository,
    PrismaService,
  ],
})
export class CommentsModule {}
