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
import {
  type ContractEventPayload,
  type LogDescription,
  type JsonRpcProvider,
  type TransactionResponse,
  type Block,
} from 'ethers';

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
      if (contractName === 'Pair') continue;

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
          const blockHash = payload.log.blockHash;
          const txHash = payload.log.transactionHash;
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
          void self.processEvent(payload.log.address, blockHash, txHash, log);
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

  async setEventListener(name: string, address: string): Promise<void> {
    try {
      const self = this;
      this.rpcService.setContract(name, address);

      const contract = this.rpcService.getContractByAddress(address);
      if (contract === undefined) {
        throw new Error('check');
      }
      const provider = this.rpcService.getProvider();
      const connectedContract = contract.connect(provider);
      const event = this.rpcService.getContractEventList(undefined, address);
      if (event !== undefined) {
        for (const value of event) {
          this.logger.log('event listener open : ', value);
          await connectedContract.addListener(value, handleEvent);
        }
      }

      function handleEvent(...event): void {
        try {
          const payload: ContractEventPayload = event[event.length - 1];
          const blockHash = payload.log.blockHash;
          const txHash = payload.log.transactionHash;
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
          void self.processEvent(payload.log.address, blockHash, txHash, log);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async processEvent(
    address: string,
    blockHash: string,
    txHash: string,
    log: LogDescription,
  ): Promise<void> {
    try {
      const eventName = log.name;
      this.logger.log('event received: ', eventName);
      const name = this.rpcService.getContractName(address);
      if (name === undefined) {
        this.logger.error('wrong address');
        throw new Error('wrong address');
      }

      const provider: JsonRpcProvider = this.rpcService.getProvider();
      const block: Block | null = await provider.getBlock(blockHash);
      if (block === null) {
        throw new Error('block is not existed');
      }
      const timestamp = block.timestamp;
      const tx: TransactionResponse | null =
        await provider.getTransaction(txHash);
      if (tx === null) {
        throw new Error('tx is not existed');
      }

      switch (name) {
        case 'Factory': {
          switch (eventName) {
            case 'PairCreated': {
              const pairObj: any = {};
              const reserveObj: any = {};
              pairObj.timestamp = timestamp;
              reserveObj.timestamp = timestamp;
              let pair: string = '';
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                pairObj[key] = log.args[i].toString();
                if (key === 'pair') {
                  pair = log.args[i].toString();
                }
              }
              if (pair === '') {
                throw new Error('PairCreated event error');
              }
              reserveObj.pair = pair;
              reserveObj.reserve0 = '0';
              reserveObj.reserve1 = '0';
              await this.fsService.writePairArrayToFile(
                'hardhat',
                'pair.array.json',
                pairObj,
              );
              await this.fsService.writeReserveArrayToFile(
                'hardhat/pair',
                `${pair}.reserve.json`,
                reserveObj,
              );
              await this.setEventListener('Pair', pair);

              break;
            }
            default:
              break;
          }
          break;
        }
        case 'Pair': {
          switch (eventName) {
            case 'Sync': {
              const pair = address;
              const reserveObj: any = {};
              reserveObj.timestamp = timestamp;
              reserveObj.event = 'Sync';
              reserveObj.pair = pair;
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                reserveObj[key] = log.args[i].toString();
              }
              await this.fsService.writeReserveArrayToFile(
                'hardhat/pair',
                `${pair}.reserve.json`,
                reserveObj,
              );
              break;
            }
            case 'Mint': {
              const user = tx.from;
              const pair = address;
              const mintObj: any = {};
              mintObj.timestamp = timestamp;
              mintObj.event = 'Mint';
              mintObj.pair = pair;
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                mintObj[key] = log.args[i].toString();
              }
              await this.fsService.writeUserArrayToFile(
                'hardhat/user',
                `${user}.${pair}.reserve.json`,
                mintObj,
              );
              await this.fsService.writeUserArrayToFile2(
                'hardhat/user',
                `${user}.reserve.json`,
                mintObj,
              );
              break;
            }
            case 'Burn': {
              const user = tx.from;
              const pair = address;
              const burnObj: any = {};
              burnObj.timestamp = timestamp;
              burnObj.event = 'Burn';
              burnObj.pair = pair;
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                burnObj[key] = log.args[i].toString();
              }
              await this.fsService.writeUserArrayToFile(
                'hardhat/user',
                `${user}.${pair}.reserve.json`,
                burnObj,
              );
              await this.fsService.writeUserArrayToFile2(
                'hardhat/user',
                `${user}.reserve.json`,
                burnObj,
              );
              break;
            }
            case 'Swap': {
              const user = tx.from;
              const pair = address;
              const swapObj: any = {};
              swapObj.timestamp = timestamp;
              swapObj.event = 'Swap';
              swapObj.pair = pair;
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                swapObj[key] = log.args[i].toString();
              }
              await this.fsService.writeUserArrayToFile(
                'hardhat/user',
                `${user}.${pair}.reserve.json`,
                swapObj,
              );
              await this.fsService.writeUserArrayToFile2(
                'hardhat/user',
                `${user}.reserve.json`,
                swapObj,
              );
              break;
            }
            default:
              break;
          }
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
