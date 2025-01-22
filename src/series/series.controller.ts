import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';
import { FindOneByUuidDto } from 'src/shared/dto/find-one-by-uuid.dto';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';

@Controller('series')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.createSeries(createSeriesDto);
  }

  @Get()
  findAll(@Query() { offset, limit }: PaginationParamsDto) {
    return this.seriesService.getAllSeries(offset, limit);
  }

  @Get(':path')
  async findOne(@Param('path') path: string) {
    const series = await this.seriesService.getSeries(path);
    return { series };
  }

  @Patch(':id')
  update(
    @Param() { id }: FindOneByUuidDto,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.updateSeries(id, updateSeriesDto);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneByUuidDto) {
    return this.seriesService.removeSeries(id);
  }
}
