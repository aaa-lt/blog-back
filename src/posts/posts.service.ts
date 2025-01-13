import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create(createPostDto);

    await this.postRepository.save(newPost);

    return newPost;
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
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.postRepository.findOne({ where: { id } });

    if (updatedPost) {
      return updatedPost;
    }

    throw new HttpException('Post not found', 404);
  }

  async remove(id: string) {
    const deleteResponse = await this.postRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', 404);
    }
  }
}
