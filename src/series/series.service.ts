import { HttpException, Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Series from './entities/series.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { SeriesNotFoundException } from './exception/seriesNotFound.exception';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private seriesRepository: Repository<Series>,
  ) {}

  async createSeries(createSeriesDto: CreateSeriesDto) {
    try {
      const newSeries = this.seriesRepository.create(createSeriesDto);

      await this.seriesRepository.save(newSeries);

      return newSeries;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Series with this title already exists', 400);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getAllSeries(offset?: number, limit?: number) {
    const [items, count] = await this.seriesRepository.findAndCount({
      relations: ['posts'],
      take: limit,
      skip: offset,
    });

    if (items) {
      return { items, count };
    }

    throw new HttpException('Series not found', 404);
  }

  async getSeries(path: string) {
    const series = await this.seriesRepository.findOne({
      relations: ['posts'],
      where: { path },
    });

    if (series) {
      return series;
    }

    throw new HttpException('Series not found', 404);
  }

  async updateSeries(id: string, updateSeriesDto: UpdateSeriesDto) {
    const post = await this.seriesRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    try {
      await this.seriesRepository.update(id, updateSeriesDto);
      return await this.seriesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new SeriesNotFoundException(id);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async removeSeries(id: string) {
    const deleteResponse = await this.seriesRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Series not found', 404);
    }
  }
}
