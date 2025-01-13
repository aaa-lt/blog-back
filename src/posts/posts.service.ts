import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
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

  async findAll() {
    const posts = await this.postRepository.find({
      where: { published: true },
    });

    if (posts) {
      return posts;
    }

    throw new HttpException('Posts not found', 404);
  }

  async findOne(path: string) {
    const post = await this.postRepository.findOne({
      where: { postPath: path },
    });

    if (post) {
      return post;
    }

    throw new HttpException('Post not found', 404);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      await this.postRepository.update(id, updatePostDto);
      const updatedPost = await this.postRepository.findOne({ where: { id } });

      if (updatedPost) {
        return updatedPost;
      }

      throw new HttpException('Post not found', 404);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Post with this path already exists', 400);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async remove(id: string) {
    const deleteResponse = await this.postRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', 404);
    }
  }
}
