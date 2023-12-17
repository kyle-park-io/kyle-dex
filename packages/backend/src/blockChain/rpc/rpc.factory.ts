import { type RpcService } from './interfaces/rpc.interface';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { GanacheRpcService } from './rpc.ganache.service';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RpcServiceFactory {
  static createService(someCondition: boolean): RpcService {
    if (someCondition) {
      return new SepoliaRpcService();
    } else {
      return new GanacheRpcService();
    }
  }
}
