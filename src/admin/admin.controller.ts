import PostEntity from 'src/posts/entities/post.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import { AdminService } from './admin.service';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { FindOneByUuidDto } from 'src/shared/dto/find-one-by-uuid.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PostsService } from 'src/posts/posts.service';
import { PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { adminPostConfig } from 'src/shared/paginateCfg/post.config';

@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class AdminController {
  constructor(
    private readonly adminSerivce: AdminService,
    private readonly postsSerivce: PostsService,
  ) {}

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.adminSerivce.createPost(createPostDto);
  }

  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @PaginatedSwaggerDocs(PostEntity, adminPostConfig)
  async getPosts(@Query() query: PaginateQuery) {
    return this.postsSerivce.getAllPosts(query, adminPostConfig);
  }

  @Get('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPost(@Param('id') id: string) {
    return this.postsSerivce.getPostById(id);
  }

  @Patch('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePost(
    @Param() { id }: FindOneByUuidDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.adminSerivce.updatePost(id, updatePostDto);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removePost(@Param() { id }: FindOneByUuidDto) {
    return this.adminSerivce.removePost(id);
  }
}
