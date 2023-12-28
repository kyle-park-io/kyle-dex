import { Injectable } from '@nestjs/common';
import { type RpcService } from './interfaces/rpc.interface';
import { JsonRpcProvider, Network } from 'ethers';
import { setTimeout } from 'timers/promises';

@Injectable()
export class HardhatRpcService implements RpcService {
  getRpc(): string {
    return 'http://127.0.0.1:8545';
  }

  getProvider(): JsonRpcProvider {
    return new JsonRpcProvider(this.getRpc());
  }

  async getNetwork(): Promise<any> {
    try {
      const provider = this.getProvider();
      const network = await provider.getNetwork();
      console.log(JSON.stringify(network, undefined, 2));
      return network;
    } catch (err) {
      console.error(err);
      await setTimeout(3000);
      await this.getNetwork();
    }
  }

  async onModuleInit(): Promise<void> {
    await this.getNetwork();
  }
}
