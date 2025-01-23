import { NotFoundException } from '@nestjs/common';

export class SeriesNotFoundException extends NotFoundException {
  constructor(seriesId?: string) {
    super(
      seriesId ? `Series with id ${seriesId} not found` : 'Series not found',
    );
  }
}
