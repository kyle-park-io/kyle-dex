import { Injectable, NotFoundException } from '@nestjs/common';
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
    const data = cacheService.get(`${dto.network}.pairList`);
    if (data === undefined) {
      throw new NotFoundException('pair list not found');
    }
    return data;
  }

  async getPair(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(`${dto.network}.pair.${dto.pairAddress}`);
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  async getClientPair(dto: GetClientPairDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.user.${dto.userAddress}.${dto.pairAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException("client's pair not found");
    }
    return data;
  }

  async getClient(dto: GetClientDto): Promise<any> {
    const data = cacheService.get(`${dto.network}.user.${dto.userAddress}`);
    if (data === undefined) {
      throw new NotFoundException('client not found');
    }
    return data;
  }
}
