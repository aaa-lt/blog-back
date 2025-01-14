import { NotFoundException } from '@nestjs/common';

export class SeriesNotFoundException extends NotFoundException {
  constructor(seriesId: string) {
    super(`Series with id ${seriesId} not found`);
  }
}
