import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';
import path from 'path';

@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { originalUrl } = req;
    if (
      originalUrl.startsWith('/api') ||
      originalUrl.startsWith('/api-dex') ||
      originalUrl.startsWith('/dex-static')
    ) {
      console.log('request: not index.html, url: ', originalUrl);
      next();
      return;
    }

    console.log('request: index.html, url: ', originalUrl);
    res.sendFile(path.resolve('build', 'index.html'));
  }
}
