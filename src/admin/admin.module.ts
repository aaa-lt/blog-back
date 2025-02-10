import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from 'src/posts/entities/post.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), PostsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
