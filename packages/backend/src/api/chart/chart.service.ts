import { Injectable } from '@nestjs/common';
import cacheService from '../../init/cache';
import {
  type GetPairListDto,
  type GetPairDto,
  type GetClientPairDto,
  type GetClientDto,
} from './dto/chart.request';

@Injectable()
export class ChartService {
  async getPairList(dto: GetPairListDto): Promise<any> {
    return cacheService.get(`${dto.network}.pairList`);
  }

  async getPair(dto: GetPairDto): Promise<any> {
    return cacheService.get(`${dto.network}.pair.${dto.pairAddress}`);
  }

  async getClientPair(dto: GetClientPairDto): Promise<any> {
    return cacheService.get(
      `${dto.network}.user.${dto.userAddress}.${dto.pairAddress}`,
    );
  }

  async getClient(dto: GetClientDto): Promise<any> {
    return cacheService.get(`${dto.network}.user.${dto.userAddress}`);
  }
}
