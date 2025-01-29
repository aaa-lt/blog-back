import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import Post from '../posts/entities/post.entity';
import Series from '../series/entities/series.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
  ) {}

  async seed() {
    // await this.clearDatabase();
    const series = await this.createSeries();
    await this.createPosts(series);
  }

  //   private async clearDatabase() {
  //     await this.postRepository.query(
  //       'TRUNCATE TABLE post, series RESTART IDENTITY CASCADE;',
  //     );
  //   }

  private generateUniqueSlug(base: string): string {
    return `${base
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]/g, '')}-${faker.string.alphanumeric(6)}`;
  }

  private async createSeries(): Promise<Series[]> {
    const seriesArray: Series[] = [];

    for (let i = 0; i < 10; i++) {
      const series = new Series();
      series.title = faker.lorem.words(3);
      series.description = faker.lorem.paragraph();
      series.imageUrl = faker.image.url();
      series.path = this.generateUniqueSlug(series.title);

      seriesArray.push(series);
    }

    return this.seriesRepository.save(seriesArray);
  }

  private async createPosts(seriesList: Series[]) {
    const posts: Post[] = [];
    const seriesPostCount = new Map<string, number>();

    // Initialize post counts for each series
    seriesList.forEach((series) => {
      seriesPostCount.set(series.id, 0);
    });

    for (let i = 0; i < 500; i++) {
      const post = new Post();
      post.title = faker.lorem.words(5);
      post.content = faker.lorem.paragraphs(20);
      post.previewContent = faker.lorem.sentence();
      post.imageUrl = faker.image.url();
      post.published = faker.datatype.boolean();
      post.path = this.generateUniqueSlug(post.title);

      const randomSeries = faker.helpers.arrayElement(seriesList);
      const postCount = (seriesPostCount.get(randomSeries.id) || 0) + 1;

      seriesPostCount.set(randomSeries.id, postCount);
      post.series = randomSeries;
      post.seriesPostId = postCount;

      posts.push(post);
    }

    await this.postRepository.save(posts);
  }
}
