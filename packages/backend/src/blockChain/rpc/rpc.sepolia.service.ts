import { Injectable } from '@nestjs/common';
import { type RpcService } from './interfaces/rpc.interface';
import { JsonRpcProvider } from 'ethers';

@Injectable()
export class SepoliaRpcService implements RpcService {
  getRpc(): string {
    return 'http://127.0.0.1:7545';
  }

  getProvider(): JsonRpcProvider {
    return new JsonRpcProvider(this.getRpc());
  }

  async getNetwork(): Promise<void> {}
}
