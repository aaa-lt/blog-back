import { PaginateConfig } from 'nestjs-paginate';
import Series from '../entities/series.entity';

const publicSeriesConfig: PaginateConfig<Series> = {
  sortableColumns: ['createdAt'],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['title'],
  defaultLimit: 10,
  maxLimit: 20,
  select: ['id', 'title', 'path', 'createdAt'],
};

export { publicSeriesConfig };
