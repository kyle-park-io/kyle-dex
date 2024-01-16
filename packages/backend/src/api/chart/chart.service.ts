import { Injectable } from '@nestjs/common';
import cacheService from '../../init/cache';

@Injectable()
export class ChartService {
  async getReserve(): Promise<any> {
    return cacheService.get('reserve');
  }
}
