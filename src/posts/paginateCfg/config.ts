import { PaginateConfig } from 'nestjs-paginate';
import Post from 'src/posts/entities/post.entity';

const publicPostConfig: PaginateConfig<Post> = {
  sortableColumns: ['createdAt'],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['title'],
  defaultLimit: 10,
  maxLimit: 20,
  where: { published: true },
  relations: ['series'],
  select: [
    'id',
    'title',
    'previewContent',
    'imageUrl',
    'path',
    'seriesPostId',
    'createdAt',
    'series.id',
    'series.title',
    'series.path',
  ],
};

const adminPostConfig: PaginateConfig<Post> = {
  ...publicPostConfig,
  sortableColumns: ['title', 'createdAt', 'path', 'series.title'],
  where: undefined,
  select: [
    'id',
    'title',
    'previewContent',
    'imageUrl',
    'path',
    'seriesPostId',
    'createdAt',
    'published',
    'series.id',
    'series.title',
    'series.path',
  ],
};

export { publicPostConfig, adminPostConfig };
