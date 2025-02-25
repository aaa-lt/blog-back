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
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { publicPostConfig } from 'src/posts/paginateCfg/config';
import Post from './entities/post.entity';
import { ApiQuery } from '@nestjs/swagger';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiQuery({ name: 'seriesPath', required: false })
  @PaginatedSwaggerDocs(Post, publicPostConfig)
  async getPosts(
    @Paginate() query: PaginateQuery,
    @Query('seriesPath') seriesPath?: string,
  ) {
    return await this.postsService.getAllPosts(query, {
      ...publicPostConfig,
      where: {
        ...publicPostConfig.where,
        ...(seriesPath && { series: { path: seriesPath } }),
      },
    });
  }

  @Get(':path')
  async getPost(@Param('path') path: string) {
    return this.postsService.getPostByPath(path);
  }
}
