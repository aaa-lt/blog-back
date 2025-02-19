import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { FindOneByUuidDto } from 'src/shared/dto/find-one-by-uuid.dto';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { publicSeriesConfig } from './paginateCfg/config';
import Series from './entities/series.entity';

@Controller('series')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ExcludeNullInterceptor)
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.createSeries(createSeriesDto);
  }

  @Get()
  @PaginatedSwaggerDocs(Series, publicSeriesConfig)
  findAll(@Paginate() query: PaginateQuery) {
    return this.seriesService.getAllSeries(query, publicSeriesConfig);
  }

  @Get(':path')
  async findOne(@Param('path') path: string) {
    const series = await this.seriesService.getSeries(path);
    return series;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param() { id }: FindOneByUuidDto,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.updateSeries(id, updateSeriesDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param() { id }: FindOneByUuidDto) {
    return this.seriesService.removeSeries(id);
  }
}
