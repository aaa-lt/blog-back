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
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';
import { FindOneByUuidDto } from 'src/shared/dto/find-one-by-uuid.dto';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  findAll(@Query() { offset, limit }: PaginationParamsDto) {
    return this.seriesService.getAllSeries(offset, limit);
  }

  @Get(':path')
  async findOne(@Param('path') path: string) {
    const series = await this.seriesService.getSeries(path);
    return { series };
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
