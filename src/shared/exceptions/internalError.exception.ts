import { InternalServerErrorException } from '@nestjs/common';

export class InternalServerException extends InternalServerErrorException {
  constructor() {
    super(`Something went wrong`);
  }
}
