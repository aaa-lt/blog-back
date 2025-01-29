import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { PostNotFoundException } from './exceptions/postNotFound.exception';
import { Order } from 'src/shared/dto/sort-order-param.dto';
import { InternalServerException } from 'src/shared/exceptions/internalError.exception';

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
      throw new InternalServerException();
    }
  }

  async getAllPosts(
    limit: number,
    offset?: number,
    order: Order = Order.ASC,
    seriesPath?: string,
  ) {
    const [items, count] = await this.postRepository.findAndCount({
      where: { published: true, series: { path: seriesPath } },
      relations: ['series'],
      select: {
        id: true,
        title: true,
        previewContent: true,
        imageUrl: true,
        path: true,
        seriesPostId: true,
        createdAt: true,
        series: {
          id: true,
          title: true,
          path: true,
        },
      },
      take: limit,
      skip: offset,
      order: {
        ...(seriesPath && { seriesPostId: order }),
        createdAt: order,
      },
    });

    if (items) {
      return { items, count };
    }

    throw new PostNotFoundException();
  }

  async getPostByPath(path: string) {
    const post = await this.postRepository.findOne({
      where: { path, published: true },
      relations: ['series'],
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        path: true,
        seriesPostId: true,
        createdAt: true,
        series: {
          id: true,
          title: true,
          path: true,
        },
      },
    });

    if (post) {
      return post;
    }

    throw new PostNotFoundException(path);
  }

  async getPostById(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['series'],
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        path: true,
        seriesPostId: true,
        createdAt: true,
        series: {
          id: true,
          title: true,
          path: true,
        },
      },
    });

    if (post) {
      return post;
    }

    throw new PostNotFoundException(id);
  }

  async getDraftPosts(limit: number, offset?: number) {
    const [items, count] = await this.postRepository.findAndCount({
      where: { published: false },
      relations: ['series'],
      select: {
        id: true,
        title: true,
        previewContent: true,
        imageUrl: true,
        path: true,
        seriesPostId: true,
        createdAt: true,
        series: {
          id: true,
          title: true,
          path: true,
        },
      },
      take: limit,
      skip: offset,
    });

    if (items) {
      return { items, count };
    }

    throw new PostNotFoundException();
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    console.log(post);

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
