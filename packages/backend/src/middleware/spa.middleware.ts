import { Injectable, NestMiddleware } from '@nestjs/common';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl } = req;
    if (
      originalUrl.startsWith('/api') ||
      originalUrl.startsWith('/dex-static')
    ) {
      console.log('not index.html req: ', originalUrl);
      return next();
    }

    console.log('index.tml req: ', originalUrl);
    res.sendFile(path.resolve('build', 'index.html'));
  }
}
