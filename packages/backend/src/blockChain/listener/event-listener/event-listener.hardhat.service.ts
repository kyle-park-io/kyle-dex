import {
  Inject,
  Injectable,
  LoggerService,
  forwardRef,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../rpc/interfaces/rpc.interface';
import { FsService } from '../../utils/fs.service';
import { type ContractEventPayload, type LogDescription } from 'ethers';

@Injectable()
export class HardhatEventListenerService implements OnModuleInit {
  private initPromise!: Promise<void>;

  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    // @Inject(forwardRef(() => 'HardhatRpc'))
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,
    // extra
    private readonly fsService: FsService,
  ) {}

  async getInitializationPromise(): Promise<void> {
    await this.initPromise;
  }

  async connectRpc(): Promise<void> {
    const self = this;
    const contractList = this.rpcService.getContractList();
    for (const contractName of contractList) {
      const address = this.rpcService.getContractAddress(contractName);
      if (address === undefined) {
        throw new Error('check');
      }
      const contract = this.rpcService.getContractByAddress(address);
      if (contract === undefined) {
        throw new Error('check');
      }

      const provider = this.rpcService.getProvider();
      const connectedContract = contract.connect(provider);
      const event = this.rpcService.getContractEventList(contractName);
      if (event !== undefined) {
        for (const value of event) {
          this.logger.log('event listener open : ', value);
          await connectedContract.addListener(value, handleEvent);
        }
      }

      function handleEvent(...event): void {
        try {
          const payload: ContractEventPayload = event[event.length - 1];
          const topics = [...payload.log.topics];
          const data = payload.log.data;
          const log: LogDescription | null =
            connectedContract.interface.parseLog({
              topics,
              data,
            });
          if (log === null) {
            throw new Error('wrong matching event <-> data');
          }
          void self.processEvent(payload.log.address, log);
        } catch (err) {
          console.error(err);
        }
      }

      // TODO : make auto reading system
      // const abi = await this.fsService.getAbi('Factory');
      // for (let i = 0; i < abi.length; i++) {
      //   console.log(abi[i].type);
      // }
    }
  }

  private async processEvent(
    address: string,
    log: LogDescription,
  ): Promise<void> {
    try {
      this.logger.log('event received: ');

      const eventName = log.name;
      const name = this.rpcService.getContractName(address);
      if (name === undefined) {
        this.logger.error('wrong address');
        throw new Error('wrong address');
      }

      switch (name) {
        case 'Factory': {
          switch (eventName) {
            case 'PairCreated': {
              const obj = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                obj[key] = log.args[i].toString();
              }
              await this.fsService.writeArrayToFile('pair.array.json', obj);
              break;
            }
            default:
              break;
          }
          break;
        }
        case 'Pair': {
          // await this.fsService.getFile('test');
          // await this.fsService.setFile('test.json', obj);
          // await this.fsService.readArrayFromFile('test.json');
          break;
        }
        default:
          this.logger.log('merong~');
          break;
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async initializeAsync(): Promise<void> {
    await this.rpcService.getInitializationPromise();
    await this.connectRpc();
  }

  async onModuleInit(): Promise<void> {
    this.initPromise = this.initializeAsync();
  }
}
