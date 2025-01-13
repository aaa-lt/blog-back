import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindOneByUuidDto } from './dto/find-one-by-uuid.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':path')
  async findOne(@Param('path') path: string) {
    return this.postsService.findOne(path);
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneByUuidDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneByUuidDto) {
    return this.postsService.remove(id);
  }
}
