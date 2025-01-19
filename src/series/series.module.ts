import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Series from './entities/series.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Series]), PostsModule],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
