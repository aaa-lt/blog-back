import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(postId?: string) {
    super(postId ? `Post with id ${postId} not found` : 'Post not found');
  }
}
