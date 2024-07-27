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
import { EventEmitterService } from '../../../event-emitter/event-emitter.service';
import {
  type ContractEventPayload,
  type LogDescription,
  type JsonRpcProvider,
  type TransactionResponse,
  type Block,
} from 'ethers';
import cacheService from '../../../init/cache';

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
    // private readonly eventEmitterService: EventEmitterService,
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
          const blockNumber = payload.log.blockNumber;
          const txHash = payload.log.transactionHash;
          const topics = [...payload.log.topics];
          const data = payload.log.data;

          // check tx cache
          if (
            cacheService.get(`hardhat.${payload.log.address}.${txHash}`) !==
            undefined
          ) {
            console.log(
              'already processed event: ',
              payload.log.address,
              txHash,
            );
            return;
          }

          const log: LogDescription | null =
            connectedContract.interface.parseLog({
              topics,
              data,
            });
          if (log === null) {
            throw new Error('wrong matching event <-> data');
          }
          void self.processEvent(
            payload.log.address,
            blockHash,
            blockNumber,
            txHash,
            log,
          );
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
          const blockNumber = payload.log.blockNumber;
          const txHash = payload.log.transactionHash;
          const topics = [...payload.log.topics];
          const data = payload.log.data;

          // check tx cache
          if (
            cacheService.get(`hardhat.${payload.log.address}.${txHash}`) !==
            undefined
          ) {
            console.log(
              'already processed event: ',
              payload.log.address,
              txHash,
            );
            return;
          }

          const log: LogDescription | null =
            connectedContract.interface.parseLog({
              topics,
              data,
            });
          if (log === null) {
            throw new Error('wrong matching event <-> data');
          }
          void self.processEvent(
            payload.log.address,
            blockHash,
            blockNumber,
            txHash,
            log,
          );
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
    contractAddress: string,
    blockHash: string,
    blockNumber: number,
    txHash: string,
    log: LogDescription,
  ): Promise<void> {
    try {
      const eventName = log.name;
      this.logger.log('event received: ', eventName);
      const name = this.rpcService.getContractName(contractAddress);
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
      const from = tx.from;
      const to = tx.to;
      // const type = tx.type;

      switch (name) {
        case 'Factory': {
          switch (eventName) {
            case 'PairCreated': {
              // pair list
              const pairObj: any = {};
              pairObj.timestamp = timestamp;
              pairObj.blockHash = blockHash;
              pairObj.blockNumber = blockNumber;
              pairObj.txHash = txHash;
              pairObj.from = from;
              pairObj.to = to;
              pairObj.event = eventName;
              // pair reserve
              const reserveObj: any = {};
              reserveObj.timestamp = timestamp;
              reserveObj.blockHash = blockHash;
              reserveObj.blockNumber = blockNumber;
              reserveObj.txHash = txHash;
              reserveObj.from = from;
              reserveObj.to = to;
              let pair: string = '';
              let index: string = '';
              const eventData = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();
                if (key === 'pair') {
                  pair = log.args[i].toString();
                }
                if (key === 'index') {
                  index = log.args[i].toString();
                }
                if (i === log.fragment.inputs.length - 1) {
                  pairObj.eventData = eventData;
                }
              }
              if (pair === '' || index === '') {
                throw new Error('PairCreated event error');
              }
              // TODO : check concurrency
              // set pair-map key
              cacheService.set(`hardhat.pair.index.${pair}`, index);

              reserveObj.pair = pair;
              reserveObj.event = eventName;
              const eventData2 = { reserve0: '0', reserve1: '0' };
              reserveObj.eventData = eventData2;

              await this.fsService.writePairArrayToFile(
                'hardhat',
                'pairs.list',
                pairObj,
              );
              await this.fsService.writePairReserveAllArrayToFile(
                'hardhat',
                `pair.reserve.all`,
                pair,
                reserveObj,
              );
              await this.fsService.writePairEventAllArrayToFile(
                'hardhat',
                'pair.event.all',
                pair,
                reserveObj,
              );
              await this.fsService.writePairsReserveListArrayToFile(
                'hardhat',
                'pairs.reserve.list',
                pair,
                reserveObj,
              );
              await this.setEventListener('Pair', pair);
              // // sse
              // this.eventEmitterService.create(
              //   'PairCreated',
              //   JSON.stringify(pairObj),
              // );
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
              const pair = contractAddress;
              const syncObj: any = {};
              syncObj.timestamp = timestamp;
              syncObj.blockHash = blockHash;
              syncObj.blockNumber = blockNumber;
              syncObj.txHash = txHash;
              syncObj.from = from;
              syncObj.to = to;
              syncObj.pair = pair;
              syncObj.event = eventName;
              const eventData = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();
                if (i === log.fragment.inputs.length - 1) {
                  syncObj.eventData = eventData;
                }
              }
              await this.fsService.writePairReserveAllArrayToFile(
                'hardhat',
                `pair.reserve.all`,
                pair,
                syncObj,
              );
              await this.fsService.writePairEventAllArrayToFile(
                'hardhat',
                'pair.event.all',
                pair,
                syncObj,
              );
              await this.fsService.writePairsReserveListArrayToFile(
                'hardhat',
                'pairs.reserve.list',
                pair,
                syncObj,
              );
              break;
            }
            case 'Mint': {
              const user = from;
              const pair = contractAddress;
              const mintObj: any = {};
              mintObj.timestamp = timestamp;
              mintObj.blockHash = blockHash;
              mintObj.blockNumber = blockNumber;
              mintObj.txHash = txHash;
              mintObj.from = from;
              mintObj.to = to;
              mintObj.pair = pair;
              mintObj.event = eventName;
              const eventData = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();
                if (i === log.fragment.inputs.length - 1) {
                  mintObj.eventData = eventData;
                }
              }
              await this.fsService.writePairEventAllArrayToFile(
                'hardhat',
                'pair.event.all',
                pair,
                mintObj,
              );
              await this.fsService.writeUserEventArrayToFile(
                'hardhat',
                'user.event',
                user,
                pair,
                mintObj,
              );
              await this.fsService.writeUserEventAllArrayToFile(
                'hardhat',
                'user.event.all',
                user,
                mintObj,
              );
              break;
            }
            case 'Burn': {
              const user = from;
              const pair = contractAddress;
              const burnObj: any = {};
              burnObj.timestamp = timestamp;
              burnObj.blockHash = blockHash;
              burnObj.blockNumber = blockNumber;
              burnObj.txHash = txHash;
              burnObj.from = from;
              burnObj.to = to;
              burnObj.pair = pair;
              burnObj.event = eventName;
              const eventData = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();
                if (i === log.fragment.inputs.length - 1) {
                  burnObj.eventData = eventData;
                }
              }
              await this.fsService.writePairEventAllArrayToFile(
                'hardhat',
                'pair.event.all',
                pair,
                burnObj,
              );
              await this.fsService.writeUserEventArrayToFile(
                'hardhat',
                'user.event',
                user,
                pair,
                burnObj,
              );
              await this.fsService.writeUserEventAllArrayToFile(
                'hardhat',
                'user.event.all',
                user,
                burnObj,
              );
              break;
            }
            case 'Swap': {
              const user = from;
              const pair = contractAddress;
              const swapObj: any = {};
              swapObj.timestamp = timestamp;
              swapObj.blockHash = blockHash;
              swapObj.blockNumber = blockNumber;
              swapObj.txHash = txHash;
              swapObj.from = from;
              swapObj.to = to;
              swapObj.pair = pair;
              swapObj.event = eventName;
              const eventData = {};
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();
                if (i === log.fragment.inputs.length - 1) {
                  swapObj.eventData = eventData;
                }
              }
              await this.fsService.writePairEventAllArrayToFile(
                'hardhat',
                'pair.event.all',
                pair,
                swapObj,
              );
              await this.fsService.writeUserEventArrayToFile(
                'hardhat',
                'user.event',
                user,
                pair,
                swapObj,
              );
              await this.fsService.writeUserEventAllArrayToFile(
                'hardhat',
                'user.event.all',
                user,
                swapObj,
              );
              break;
            }
            case 'Transfer': {
              console.log('transfer');

              const pair = contractAddress;
              const transferObj: any = {};
              transferObj.timestamp = timestamp;
              transferObj.blockHash = blockHash;
              transferObj.blockNumber = blockNumber;
              transferObj.txHash = txHash;
              transferObj.from = from;
              transferObj.to = to;
              transferObj.pair = pair;
              transferObj.event = eventName;
              const eventData = {};
              let tokenFrom = '';
              let tokenTo = '';
              let tokenValue = '';
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();

                if (key === 'from') {
                  tokenFrom = log.args[i].toString();
                }
                if (key === 'to') {
                  tokenTo = log.args[i].toString();
                }
                if (key === 'value') {
                  tokenValue = log.args[i].toString();
                }
                if (i === log.fragment.inputs.length - 1) {
                  transferObj.eventData = eventData;
                }
              }
              if (tokenFrom === '' || tokenTo === '' || tokenValue === '') {
                throw new Error('Transfer event error');
              }

              // await this.fsService.writePairEventAllArrayToFile(
              //   'hardhat',
              //   'pair.event.all',
              //   pair,
              //   mintObj,
              // );
              // await this.fsService.writeUserEventArrayToFile(
              //   'hardhat',
              //   'user.event',
              //   user,
              //   pair,
              //   mintObj,
              // );
              // await this.fsService.writeUserEventAllArrayToFile(
              //   'hardhat',
              //   'user.event.all',
              //   user,
              //   mintObj,
              // );
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

      // set cache
      cacheService.set(`hardhat.${contractAddress}.${txHash}`, timestamp);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async initializeAsync(): Promise<void> {
    await this.rpcService.getInitializationPromise();
    if (this.rpcService.getNetworkStatus()) {
      await this.connectRpc();
    }
  }

  async onModuleInit(): Promise<void> {
    this.initPromise = this.initializeAsync();
  }
}
