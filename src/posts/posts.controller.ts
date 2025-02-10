import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import { PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { publicPostConfig } from 'src/shared/paginateCfg/post.config';
import Post from './entities/post.entity';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @PaginatedSwaggerDocs(Post, publicPostConfig)
  async getPosts(@Query() query: PaginateQuery) {
    return await this.postsService.getAllPosts(query, publicPostConfig);
  }

  @Get(':path')
  async getPost(@Param('path') path: string) {
    return this.postsService.getPostByPath(path);
  }
}
