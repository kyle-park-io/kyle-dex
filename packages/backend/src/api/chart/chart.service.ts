import { Injectable, NotFoundException } from '@nestjs/common';
import cacheService from '../../init/cache';
import {
  type GetPairListDto,
  type GetPairsDto,
  type GetPairDto,
  type GetTokenDto,
  type GetClientEventAllDto,
  type GetClientPairEventDto,
  type GetClientTokenEventDto,
} from './dto/chart.request';

@Injectable()
export class ChartService {
  async getPairList(dto: GetPairListDto): Promise<any> {
    const data = cacheService.get(`network.${dto.network}.pairs.list`);
    if (data === undefined) {
      throw new NotFoundException('pair list not found');
    }
    return data;
  }

  async getPairProperty(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.pair.${dto.pairAddress}.property`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  async getPairsCurrentReserve(dto: GetPairsDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.pairs.current.reserve`,
    );
    if (data === undefined) {
      throw new NotFoundException('pairs reserve not found');
    }
    return data;
  }

  async getPairCurrentReserve(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.pair.${dto.pairAddress}.current.reserve`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair reserve not found');
    }
    return data;
  }

  async getPairReserveAll(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.pair.${dto.pairAddress}.event.sync`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  // pair event
  async getPairEventAll(dto: GetPairDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.pair.${dto.pairAddress}.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }

  async getClientPairsEvent(dto: GetClientEventAllDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.user.${dto.userAddress}.pairs.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException('client not found');
    }
    return data;
  }

  async getClientPairEvent(dto: GetClientPairEventDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.user.${dto.userAddress}.pair.${dto.pairAddress}.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException("client's pair not found");
    }
    return data;
  }

  // token event
  async getTokenEventAll(dto: GetTokenDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.token.${dto.tokenAddress}.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException('token event not found');
    }
    return data;
  }

  async getClientTokensEvent(dto: GetClientEventAllDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.user.${dto.userAddress}.tokens.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException("client's token event not found");
    }
    return data;
  }

  async getClientTokenEvent(dto: GetClientTokenEventDto): Promise<any> {
    const data = cacheService.get(
      `network.${dto.network}.user.${dto.userAddress}.token.${dto.tokenAddress}.event.all`,
    );
    if (data === undefined) {
      throw new NotFoundException("client's token event not found");
    }
    return data;
  }
}
