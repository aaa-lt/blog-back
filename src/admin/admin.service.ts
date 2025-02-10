import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { InternalServerException } from 'src/shared/exceptions/internalError.exception';
import Post from 'src/posts/entities/post.entity';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostNotFoundException } from 'src/posts/exceptions/postNotFound.exception';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';

@Injectable()
export class AdminService {
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
      throw new InternalServerException();
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new PostNotFoundException(id);
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
      throw new InternalServerException();
    }
  }

  async removePost(id: string) {
    const deleteResponse = await this.postRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
