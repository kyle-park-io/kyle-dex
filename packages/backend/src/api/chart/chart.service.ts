import { Injectable, NotFoundException } from '@nestjs/common';
import cacheService from '../../init/cache';
import {
  type GetPairListDto,
  type GetPairDto,
  type GetPairsDto,
  type GetClientEventDto,
  type GetClientEventAllDto,
} from './dto/chart.request';

@Injectable()
export class ChartService {
  async getPairList(dto: GetPairListDto): Promise<any> {
    const data = cacheService.get(`${dto.network}.pairs.list`);
    if (data === undefined) {
      throw new NotFoundException('pair list not found');
    }
    return data;
  }

  async getPairsCurrentReserve(dto: GetPairsDto): Promise<any> {
    const data = cacheService.get(`${dto.network}.pairs.current.reserve`);
    if (data === undefined) {
      throw new NotFoundException('pairs reserve not found');
    }
    return data;
  }

  async getPairCurrentReserve(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.pair.current.reserve.${dto.pairAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair reserve not found');
    }
    return data;
  }

  async getPairReserveAll(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.pair.reserve.all.${dto.pairAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  async getPairEventAll(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.pair.event.all.${dto.pairAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  async getClientPairsEvent(dto: GetClientEventAllDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.user.event.all.${dto.userAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException('client not found');
    }
    return data;
  }

  async getClientPairEvent(dto: GetClientEventDto): Promise<any> {
    const data = cacheService.get(
      `${dto.network}.user.event.${dto.userAddress}.${dto.pairAddress}`,
    );
    if (data === undefined) {
      throw new NotFoundException("client's pair not found");
    }
    return data;
  }
}
