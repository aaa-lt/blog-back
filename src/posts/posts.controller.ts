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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindOneByUuidDto } from '../shared/dto/find-one-by-uuid.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { OrderSortParamDto } from 'src/shared/dto/sort-order-param.dto';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import { GetPostDto } from './dto/get-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  async getPosts(
    @Query() { offset, limit }: PaginationParamsDto,
    @Query() { order }: OrderSortParamDto,
    @Query() { seriesPath }: GetPostDto,
  ) {
    return this.postsService.getAllPosts(limit, offset, order, seriesPath);
  }

  @Get('/drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getDraftPosts(@Query() { offset, limit }: PaginationParamsDto) {
    return this.postsService.getDraftPosts(limit, offset);
  }

  @Get('/drafts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async get(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Get(':path')
  async getPost(@Param('path') path: string) {
    return this.postsService.getPostByPath(path);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePost(
    @Param() { id }: FindOneByUuidDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removePost(@Param() { id }: FindOneByUuidDto) {
    return this.postsService.removePost(id);
  }
}
