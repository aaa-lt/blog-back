import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${responseTime.toFixed(2)}ms`,
      );
    });

    next();
  }
}
