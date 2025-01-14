import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { PostNotFoundException } from './exception/postNotFound.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    try {
      const newPost = this.postRepository.create(createPostDto);

      await this.postRepository.save(newPost);

      return newPost;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Post with this path already exists', 400);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getAllPosts(offset?: number, limit?: number) {
    const [items, count] = await this.postRepository.findAndCount({
      where: { published: true },
      take: limit,
      skip: offset,
    });

    if (items) {
      return { items, count };
    }

    throw new HttpException('Posts not found', 404);
  }

  async getPost(path: string) {
    const post = await this.postRepository.findOne({
      where: { path },
    });

    if (post) {
      return post;
    }

    throw new HttpException('Post not found', 404);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    try {
      await this.postRepository.update(id, updatePostDto);
      return await this.postRepository.findOne({
        where: { id },
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new PostNotFoundException(id);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async removePost(id: string) {
    const deleteResponse = await this.postRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', 404);
    }
  }
}
