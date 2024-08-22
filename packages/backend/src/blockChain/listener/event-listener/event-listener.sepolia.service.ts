import {
  Inject,
  Injectable,
  LoggerService,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../rpc/interfaces/rpc.interface';
import { FsService } from '../../utils/fs.service';
import { EventEmitterService } from '../../../event-emitter/event-emitter.service';
import {
  type Contract,
  type ContractEventPayload,
  type LogDescription,
  type JsonRpcProvider,
  type TransactionResponse,
  type Block,
  keccak256,
  toUtf8Bytes,
  ZeroAddress,
} from 'ethers';
import cacheService from '../../../init/cache';

@Injectable()
export class SepoliaEventListenerService implements OnModuleInit {
  private initPromise!: Promise<void>;
  private readonly network = 'sepolia';

  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    @Inject('SepoliaRpc')
    private readonly rpcService: RpcService,
    // extra
    private readonly fsService: FsService,
    // private readonly eventEmitterService: EventEmitterService,
  ) {}

  async getInitializationPromise(): Promise<void> {
    await this.initPromise;
  }

  async connectRpc(): Promise<void> {
    const contractList = this.rpcService.getContractList();
    for (const contractName of contractList) {
      if (contractName === 'Pair' || contractName === 'Token') continue;

      const address = this.rpcService.getContractAddress(contractName);
      if (address === undefined) {
        continue;
        // throw new Error('contract address is not existed');
      }
      const contract = this.rpcService.getContractByAddress(address);
      if (contract === undefined) {
        throw new Error('contract is not existed');
      }

      const provider = this.rpcService.getProvider();
      const connectedContract = contract.connect(provider);
      const event = contractName.includes('token')
        ? this.rpcService.getContractEventList('Token')
        : this.rpcService.getContractEventList(contractName);
      if (event !== undefined) {
        for (const value of event) {
          this.logger.log(`${value} event listener open: `, address);
          await connectedContract.addListener(value, (...event) => {
            try {
              this.handleEvent(connectedContract, event);
            } catch (err) {
              this.logger.error('Error handling event:', err);
              throw err;
            }
          });
        }
      }
    }
  }

  async reconnectRpc(): Promise<void> {
    const contractList = this.rpcService.getCurrentDeployedContractList();

    for (const list of contractList) {
      const connectedContract = this.rpcService.getContractByAddress(
        list.address,
      ) as Contract;
      if (connectedContract === undefined) {
        throw new Error('contract is not existed');
      }

      // remove
      await connectedContract.removeAllListeners();

      // add
      const event = list.name.includes('token')
        ? this.rpcService.getContractEventList('Token')
        : list.name.includes('Pair')
          ? this.rpcService.getContractEventList('Pair')
          : this.rpcService.getContractEventList(list.name);
      if (event !== undefined) {
        for (const value of event) {
          this.logger.log(`${value} event listener reopen: `, list.address);
          await connectedContract.addListener(value, (...event) => {
            try {
              this.handleEvent(connectedContract, event);
            } catch (err) {
              this.logger.error('Error handling event:', err);
              throw err;
            }
          });
        }
      }
    }
  }

  async setEventListener(name: string, address: string): Promise<void> {
    try {
      this.rpcService.addNewContract(name, address);

      const contract = this.rpcService.getContractByAddress(address);
      if (contract === undefined) {
        throw new Error('contract is not existed');
      }
      const provider = this.rpcService.getProvider();
      const connectedContract = contract.connect(provider);
      const event = this.rpcService.getContractEventList(undefined, address);
      if (event !== undefined) {
        for (const value of event) {
          this.logger.log(`${value} event listener open: `, address);
          await connectedContract.addListener(value, (...event) => {
            try {
              this.handleEvent(connectedContract, event);
            } catch (err) {
              this.logger.error('Error handling event:', err);
              throw err;
            }
          });
        }
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  handleEvent(connectedContract, event): void {
    try {
      const payload: ContractEventPayload = event[event.length - 1];
      const blockHash = payload.log.blockHash;
      const blockNumber = payload.log.blockNumber;
      const txHash = payload.log.transactionHash;
      const topics = [...payload.log.topics];
      const data = payload.log.data;

      const log: LogDescription | null = connectedContract.interface.parseLog({
        topics,
        data,
      });
      if (log === null) {
        throw new Error('wrong matching event <-> data');
      }
      // check tx cache
      const hashedLog = keccak256(toUtf8Bytes(log.signature));
      if (
        cacheService.get(
          `network.${this.network}.${payload.log.address}.${txHash}.${hashedLog}`,
        ) !== undefined
      ) {
        this.logger.log(
          'already processed event: ',
          log.name,
          payload.log.address,
          txHash,
          hashedLog,
        );
        return;
      }

      void this.processEvent(
        payload.log.address,
        blockHash,
        blockNumber,
        txHash,
        log,
      );

      const eventNum = cacheService.get(`network.${this.network}.event.num`);
      this.logger.log('number of loaded events: ', Number(eventNum) + 1);
      cacheService.set(
        `network.${this.network}.event.num`,
        String(Number(eventNum) + 1),
      );
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
      this.logger.log(`${eventName} event received: `);
      let name = this.rpcService.getContractName(contractAddress);
      if (name === undefined) {
        this.logger.error('wrong address');
        throw new Error('wrong address');
      }
      if (name.includes('token')) {
        name = 'Token';
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
              let token0: string = '';
              let token1: string = '';
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
                if (key === 'token0') {
                  token0 = log.args[i].toString();
                }
                if (key === 'token1') {
                  token1 = log.args[i].toString();
                }
                if (i === log.fragment.inputs.length - 1) {
                  pairObj.eventData = eventData;
                }
              }
              if (
                pair === '' ||
                index === '' ||
                token0 === '' ||
                token1 === ''
              ) {
                throw new Error('PairCreated event error');
              }
              // TODO : check concurrency
              // set pair-map key
              cacheService.set(
                `network.${this.network}.pair.${pair}.index`,
                index,
              );

              // pair property
              cacheService.set(
                `network.${this.network}.pair.${pair}.property`,
                {
                  token0,
                  token1,
                },
              );

              reserveObj.pair = pair;
              reserveObj.event = eventName;
              const eventData2 = { reserve0: '0', reserve1: '0' };
              reserveObj.eventData = eventData2;

              // network.${}.pairs.list
              await this.fsService.writePairListToFile(this.network, pairObj);
              // network.${}.pairs.current.reserve
              await this.fsService.writePairsCurrentReserveToFile(
                this.network,
                pair,
                reserveObj,
              );
              // network.${}.pair.${}.event.sync
              await this.fsService.writePairSyncEventToFile(
                this.network,
                pair,
                reserveObj,
              );
              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                reserveObj,
              );

              // TODO: pair contract name
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

              // network.${}.pairs.current.reserve
              await this.fsService.writePairsCurrentReserveToFile(
                this.network,
                pair,
                syncObj,
              );
              // network.${}.pair.${}.event.sync
              await this.fsService.writePairSyncEventToFile(
                this.network,
                pair,
                syncObj,
              );
              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
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

              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                mintObj,
              );
              // network.${}.user.${}.pairs.event.all
              await this.fsService.writeUserPairsAllEventToFile(
                this.network,
                user,
                mintObj,
              );
              // network.${}.user.${}.pair.${}.event.all
              await this.fsService.writeUserPairAllEventToFile(
                this.network,
                user,
                pair,
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

              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                burnObj,
              );
              // network.${}.user.${}.pairs.event.all
              await this.fsService.writeUserPairsAllEventToFile(
                this.network,
                user,
                burnObj,
              );
              // network.${}.user.${}.pair.${}.event.all
              await this.fsService.writeUserPairAllEventToFile(
                this.network,
                user,
                pair,
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

              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                swapObj,
              );
              // network.${}.user.${}.pairs.event.all
              await this.fsService.writeUserPairsAllEventToFile(
                this.network,
                user,
                swapObj,
              );
              // network.${}.user.${}.pair.${}.event.all
              await this.fsService.writeUserPairAllEventToFile(
                this.network,
                user,
                pair,
                swapObj,
              );

              break;
            }
            case 'Transfer': {
              const user = from;
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

              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                transferObj,
              );
              // network.${}.user.${}.pairs.event.all
              await this.fsService.writeUserPairsAllEventToFile(
                this.network,
                user,
                transferObj,
              );
              // network.${}.user.${}.pair.${}.event.all
              await this.fsService.writeUserPairAllEventToFile(
                this.network,
                user,
                pair,
                transferObj,
              );
              // network.${}.user.${}.pair.${}.event.transfer
              await this.fsService.writeUserPairTransferEventToFile(
                this.network,
                tokenFrom,
                pair,
                transferObj,
              );
              await this.fsService.writeUserPairTransferEventToFile(
                this.network,
                tokenTo,
                pair,
                transferObj,
              );

              // transfer cache
              const toIndex = cacheService.get(
                `network.${this.network}.user.${tokenTo}.balancesOf.${pair}.index`,
              );
              const toBalancesList = cacheService.get(
                `network.${this.network}.user.${tokenTo}.balancesOf`,
              );
              if (toBalancesList === undefined) {
                if (toIndex !== undefined) {
                  throw new Error("There's a gap in the cache!");
                }
                this.logger.warn(
                  `First inject:\nuser: ${tokenTo}, pair: ${pair}`,
                );
                const value = {
                  type: 'pair',
                  address: pair,
                  balanceOf: tokenValue,
                };
                cacheService.set(
                  `network.${this.network}.user.${tokenTo}.balancesOf.${pair}.index`,
                  '0',
                );
                cacheService.set(
                  `network.${this.network}.user.${tokenTo}.balancesOf`,
                  JSON.stringify([value], undefined, 2),
                );
                await this.fsService.writeUserBalancesOfToFile(
                  this.network,
                  tokenTo,
                  0,
                  value,
                );
              } else {
                if (typeof toBalancesList !== 'string') {
                  throw new Error('Incorrect data type');
                }
                if (toIndex === undefined) {
                  const balancesOf = JSON.parse(toBalancesList);
                  this.logger.warn(
                    `First inject:\nuser: ${tokenTo}, pair: ${pair}`,
                  );
                  const value = {
                    type: 'pair',
                    address: pair,
                    balanceOf: tokenValue,
                  };
                  balancesOf.push(value);
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf.${pair}.index`,
                    (balancesOf.length - 1).toString(),
                  );
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf`,
                    JSON.stringify(balancesOf, undefined, 2),
                  );
                  await this.fsService.writeUserBalancesOfToFile(
                    this.network,
                    tokenTo,
                    balancesOf.length - 1,
                    value,
                  );
                } else {
                  const balancesOf = JSON.parse(toBalancesList);
                  const beforeBalanceOf = balancesOf[Number(toIndex)].balanceOf;
                  const afterBalanceOf = BigInt(
                    BigInt(beforeBalanceOf) + BigInt(tokenValue),
                  ).toString();
                  balancesOf[Number(toIndex)].balanceOf = afterBalanceOf;
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf`,
                    JSON.stringify(balancesOf, undefined, 2),
                  );
                  const value = {
                    type: 'pair',
                    address: pair,
                    balanceOf: afterBalanceOf,
                  };
                  await this.fsService.writeUserBalancesOfToFile(
                    this.network,
                    tokenTo,
                    Number(toIndex),
                    value,
                  );
                }
              }
              if (tokenFrom === ZeroAddress) break;
              const fromIndex = cacheService.get(
                `network.${this.network}.user.${tokenFrom}.balancesOf.${pair}.index`,
              );
              const fromBalancesList = cacheService.get(
                `network.${this.network}.user.${tokenFrom}.balancesOf`,
              );
              if (fromBalancesList === undefined) {
                throw new Error("There's a gap in the cache!");
              } else {
                if (fromIndex === undefined) {
                  throw new Error("There's a gap in the cache!");
                }
                if (typeof fromBalancesList !== 'string') {
                  throw new Error('Incorrect data type');
                }
                const balancesOf = JSON.parse(fromBalancesList);
                const beforeBalanceOf = balancesOf[Number(fromIndex)].balanceOf;
                const afterBalanceOf = BigInt(
                  BigInt(beforeBalanceOf) - BigInt(tokenValue),
                ).toString();
                balancesOf[Number(fromIndex)].balanceOf = afterBalanceOf;
                cacheService.set(
                  `network.${this.network}.user.${tokenFrom}.balancesOf`,
                  JSON.stringify(balancesOf, undefined, 2),
                );
                const value = {
                  type: 'pair',
                  address: pair,
                  balanceOf: afterBalanceOf,
                };
                await this.fsService.writeUserBalancesOfToFile(
                  this.network,
                  tokenFrom,
                  Number(fromIndex),
                  value,
                );
              }

              break;
            }
            case 'Approval': {
              const user = from;
              const pair = contractAddress;
              const approvalObj: any = {};
              approvalObj.timestamp = timestamp;
              approvalObj.blockHash = blockHash;
              approvalObj.blockNumber = blockNumber;
              approvalObj.txHash = txHash;
              approvalObj.from = from;
              approvalObj.to = to;
              approvalObj.pair = pair;
              approvalObj.event = eventName;
              const eventData = {};
              let tokenOwner = '';
              let tokenSpender = '';
              let tokenValue = '';
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();

                if (key === 'owner') {
                  tokenOwner = log.args[i].toString();
                }
                if (key === 'spender') {
                  tokenSpender = log.args[i].toString();
                }
                if (key === 'value') {
                  tokenValue = log.args[i].toString();
                }
                if (i === log.fragment.inputs.length - 1) {
                  approvalObj.eventData = eventData;
                }
              }
              if (
                tokenOwner === '' ||
                tokenSpender === '' ||
                tokenValue === ''
              ) {
                throw new Error('Approval event error');
              }

              // network.${}.pair.${}.event.all
              await this.fsService.writePairAllEventToFile(
                this.network,
                pair,
                approvalObj,
              );
              // network.${}.user.${}.pairs.event.all
              await this.fsService.writeUserPairsAllEventToFile(
                this.network,
                user,
                approvalObj,
              );
              // network.${}.user.${}.pair.${}.event.all
              await this.fsService.writeUserPairAllEventToFile(
                this.network,
                user,
                pair,
                approvalObj,
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
        case 'Token': {
          switch (eventName) {
            case 'Transfer': {
              const user = from;
              const token = contractAddress;
              const transferObj: any = {};
              transferObj.timestamp = timestamp;
              transferObj.blockHash = blockHash;
              transferObj.blockNumber = blockNumber;
              transferObj.txHash = txHash;
              transferObj.from = from;
              transferObj.to = to;
              transferObj.token = token;
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

              // network.${}.token.${}.event.all
              await this.fsService.writeTokenAllEventToFile(
                this.network,
                token,
                transferObj,
              );
              // network.${}.user.${}.tokens.event.all
              await this.fsService.writeUserTokensAllEventToFile(
                this.network,
                user,
                transferObj,
              );
              // network.${}.user.${}.token.${}.event.all
              await this.fsService.writeUserTokenAllEventToFile(
                this.network,
                user,
                token,
                transferObj,
              );
              // network.${}.user.${}.token.${}.event.transfer
              await this.fsService.writeUserTokenTransferEventToFile(
                this.network,
                tokenFrom,
                token,
                transferObj,
              );
              await this.fsService.writeUserTokenTransferEventToFile(
                this.network,
                tokenTo,
                token,
                transferObj,
              );

              // transfer cache
              const toIndex = cacheService.get(
                `network.${this.network}.user.${tokenTo}.balancesOf.${token}.index`,
              );
              const toBalancesList = cacheService.get(
                `network.${this.network}.user.${tokenTo}.balancesOf`,
              );
              if (toBalancesList === undefined) {
                if (toIndex !== undefined) {
                  throw new Error("There's a gap in the cache!");
                }
                this.logger.warn(
                  `First inject:\nuser: ${tokenTo}, token: ${token}`,
                );
                const value = {
                  type: 'token',
                  address: token,
                  balanceOf: tokenValue,
                };
                cacheService.set(
                  `network.${this.network}.user.${tokenTo}.balancesOf.${token}.index`,
                  '0',
                );
                cacheService.set(
                  `network.${this.network}.user.${tokenTo}.balancesOf`,
                  JSON.stringify([value], undefined, 2),
                );
                await this.fsService.writeUserBalancesOfToFile(
                  this.network,
                  tokenTo,
                  0,
                  value,
                );
              } else {
                if (typeof toBalancesList !== 'string') {
                  throw new Error('Incorrect data type');
                }
                if (toIndex === undefined) {
                  const balancesOf = JSON.parse(toBalancesList);
                  this.logger.warn(
                    `First inject:\nuser: ${tokenTo}, token: ${token}`,
                  );
                  const value = {
                    type: 'token',
                    address: token,
                    balanceOf: tokenValue,
                  };
                  balancesOf.push(value);
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf.${token}.index`,
                    (balancesOf.length - 1).toString(),
                  );
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf`,
                    JSON.stringify(balancesOf, undefined, 2),
                  );
                  await this.fsService.writeUserBalancesOfToFile(
                    this.network,
                    tokenTo,
                    balancesOf.length - 1,
                    value,
                  );
                } else {
                  const balancesOf = JSON.parse(toBalancesList);
                  const beforeBalanceOf = balancesOf[Number(toIndex)].balanceOf;
                  const afterBalanceOf = BigInt(
                    BigInt(beforeBalanceOf) + BigInt(tokenValue),
                  ).toString();
                  balancesOf[Number(toIndex)].balanceOf = afterBalanceOf;
                  cacheService.set(
                    `network.${this.network}.user.${tokenTo}.balancesOf`,
                    JSON.stringify(balancesOf, undefined, 2),
                  );
                  const value = {
                    type: 'token',
                    address: token,
                    balanceOf: afterBalanceOf,
                  };
                  await this.fsService.writeUserBalancesOfToFile(
                    this.network,
                    tokenTo,
                    Number(toIndex),
                    value,
                  );
                }
              }
              if (tokenFrom === ZeroAddress) break;
              const fromIndex = cacheService.get(
                `network.${this.network}.user.${tokenFrom}.balancesOf.${token}.index`,
              );
              const fromBalancesList = cacheService.get(
                `network.${this.network}.user.${tokenFrom}.balancesOf`,
              );
              if (fromBalancesList === undefined) {
                throw new Error("There's a gap in the cache!");
              } else {
                if (fromIndex === undefined) {
                  throw new Error("There's a gap in the cache!");
                }
                if (typeof fromBalancesList !== 'string') {
                  throw new Error('Incorrect data type');
                }
                const balancesOf = JSON.parse(fromBalancesList);
                const beforeBalanceOf = balancesOf[Number(fromIndex)].balanceOf;
                const afterBalanceOf = BigInt(
                  BigInt(beforeBalanceOf) - BigInt(tokenValue),
                ).toString();
                balancesOf[Number(fromIndex)].balanceOf = afterBalanceOf;
                cacheService.set(
                  `network.${this.network}.user.${tokenFrom}.balancesOf`,
                  JSON.stringify(balancesOf, undefined, 2),
                );
                const value = {
                  type: 'token',
                  address: token,
                  balanceOf: afterBalanceOf,
                };
                await this.fsService.writeUserBalancesOfToFile(
                  this.network,
                  tokenFrom,
                  Number(fromIndex),
                  value,
                );
              }

              break;
            }
            case 'Approval': {
              const user = from;
              const token = contractAddress;
              const approvalObj: any = {};
              approvalObj.timestamp = timestamp;
              approvalObj.blockHash = blockHash;
              approvalObj.blockNumber = blockNumber;
              approvalObj.txHash = txHash;
              approvalObj.from = from;
              approvalObj.to = to;
              approvalObj.token = token;
              approvalObj.event = eventName;
              const eventData = {};
              let tokenOwner = '';
              let tokenSpender = '';
              let tokenValue = '';
              for (let i = 0; i < log.fragment.inputs.length; i++) {
                const key = log.fragment.inputs[i].name;
                eventData[key] = log.args[i].toString();

                if (key === 'owner') {
                  tokenOwner = log.args[i].toString();
                }
                if (key === 'spender') {
                  tokenSpender = log.args[i].toString();
                }
                if (key === 'value') {
                  tokenValue = log.args[i].toString();
                }
                if (i === log.fragment.inputs.length - 1) {
                  approvalObj.eventData = eventData;
                }
              }
              if (
                tokenOwner === '' ||
                tokenSpender === '' ||
                tokenValue === ''
              ) {
                throw new Error('Approval event error');
              }

              // network.${}.token.${}.event.all
              await this.fsService.writeTokenAllEventToFile(
                this.network,
                token,
                approvalObj,
              );
              // network.${}.user.${}.tokens.event.all
              await this.fsService.writeUserTokensAllEventToFile(
                this.network,
                user,
                approvalObj,
              );
              // network.${}.user.${}.token.${}.event.all
              await this.fsService.writeUserTokenAllEventToFile(
                this.network,
                user,
                token,
                approvalObj,
              );

              break;
            }
          }
          break;
        }
        default:
          this.logger.log('merong~');
          break;
      }

      const hashedLog = keccak256(toUtf8Bytes(log.signature));
      // set cache
      cacheService.set(
        `network.${this.network}.${contractAddress}.${txHash}.${hashedLog}`,
        timestamp,
      );
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
