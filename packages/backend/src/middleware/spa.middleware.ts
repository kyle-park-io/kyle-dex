import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl } = req;
    if (
      originalUrl.startsWith('/api') ||
      originalUrl.startsWith('/api-dex') ||
      originalUrl.startsWith('/dex-static')
    ) {
      console.log('not index.html req: ', originalUrl);
      return next();
    }

    console.log('index.html req: ', originalUrl);
    res.sendFile(path.resolve('build', 'index.html'));
  }
}
