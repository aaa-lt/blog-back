import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exceptions/postNotFound.exception';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getAllPosts(query: PaginateQuery, cfg: PaginateConfig<Post>) {
    return await paginate(query, this.postRepository, cfg);
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
        previewContent: true,
        imageUrl: true,
        path: true,
        seriesPostId: true,
        createdAt: true,
        published: true,
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
}
