/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import fs from 'fs';
import path from 'path';
import cacheService from '../../init/cache';

@Injectable()
export class FsService {
  private readonly dataPath: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.dataPath = path.resolve('data');
  }

  getAbi = async (contractName: string): Promise<any[]> => {
    if (contractName.includes('token') || contractName === 'Token') {
      const abiPath = path.resolve('artifacts');
      const jsonInterface = JSON.parse(
        fs.readFileSync(`${abiPath}/Token.json`, 'utf-8'),
      );
      const abi = jsonInterface.abi;
      return abi;
    } else {
      const abiPath = path.resolve('artifacts');
      const jsonInterface = JSON.parse(
        fs.readFileSync(`${abiPath}/${contractName}.json`, 'utf-8'),
      );
      const abi = jsonInterface.abi;
      return abi;
    }
  };

  getBytecode = async (contractName: string): Promise<string> => {
    const abiPath = path.resolve('artifacts');
    const jsonInterface = JSON.parse(
      fs.readFileSync(`${abiPath}/${contractName}.json`, 'utf-8'),
    );
    const bytecode = jsonInterface.bytecode;
    return bytecode;
  };

  getDeployedBytecode = async (contractName: string): Promise<string> => {
    const abiPath = path.resolve('artifacts');
    const jsonInterface = JSON.parse(
      fs.readFileSync(`${abiPath}/${contractName}.json`, 'utf-8'),
    );
    const bytecode = jsonInterface.deployedBytecode;
    return bytecode;
  };

  getContractAddress = async (contractName: string): Promise<string> => {
    const contractPath = path.resolve('contracts');
    const contract = fs.readFileSync(
      `${contractPath}/${contractName}.contract.json`,
      'utf8',
    );
    const parsedContract = JSON.parse(contract);
    const contractAddress = parsedContract.contractAddress;
    return contractAddress;
  };

  getFile = async (name: string): Promise<string> => {
    const data = fs.readFileSync(`${this.dataPath}/${name}.txt`, 'utf8');
    return data;
  };

  setFile = async (name: string, body: any): Promise<void> => {
    fs.appendFileSync(`${this.dataPath}/${name}`, JSON.stringify(body) + '\n');
  };

  readArrayFromFile = async (path: string, name: string): Promise<any> => {
    const data = fs.readFileSync(
      `${this.dataPath}/${path}/${name}.json`,
      'utf8',
    );
    const array = JSON.parse(data);
    return array;
  };

  // network.${}.pairs.list
  writePairListToFile = async (network: string, body: any): Promise<void> => {
    const path = `${network}/pair`;
    const name = `network.${network}.pairs.list`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.pairs.current.reserve
  writePairsCurrentReserveToFile = async (
    network: string,
    pair: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/pair`;
    const name = `network.${network}.pairs.current.reserve`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      // network.${}.pair.${}.index
      const index = cacheService.get(`network.${network}.pair.${pair}.index`);
      if (index === undefined) {
        throw new Error('wrong pair address');
      }

      const data = await this.readArrayFromFile(path, name);
      data[Number(index)] = body;
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );

      // network.${}.pair.${}.current.reserve
      cacheService.set(
        `network.${network}.pair.${pair}.current.reserve`,
        JSON.stringify(body, null, 2),
      );
      cacheService.set(name, JSON.stringify(data, null, 2));
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      // TODO : check concurrency
      const data: any[] = [];
      data.push(body);
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.pair.${}.event.sync
  writePairSyncEventToFile = async (
    network: string,
    pair: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/pair/sync`;
    const name = `network.${network}.pair.${pair}.event.sync`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.pair.${}.event.all
  writePairAllEventToFile = async (
    network: string,
    pair: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/pair/all`;
    const name = `network.${network}.pair.${pair}.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, {
        recursive: true,
      });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.pairs.event.all
  writeUserPairsAllEventToFile = async (
    network: string,
    user: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}`;
    const name = `network.${network}.user.${user}.pairs.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, {
        recursive: true,
      });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.pair.${}.event.all
  writeUserPairAllEventToFile = async (
    network: string,
    user: string,
    pair: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}/pair`;
    const name = `network.${network}.user.${user}.pair.${pair}.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.token.${}.event.all
  writeTokenAllEventToFile = async (
    network: string,
    token: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/token/all`;
    const name = `network.${network}.token.${token}.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, {
        recursive: true,
      });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.tokens.event.all
  writeUserTokensAllEventToFile = async (
    network: string,
    user: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}`;
    const name = `network.${network}.user.${user}.tokens.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, {
        recursive: true,
      });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.token.${}.event.all
  writeUserTokenAllEventToFile = async (
    network: string,
    user: string,
    token: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}/token`;
    const name = `network.${network}.user.${user}.token.${token}.event.all`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.pair.${}.event.transfer
  writeUserPairTransferEventToFile = async (
    network: string,
    user: string,
    pair: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}/transfer/pair`;
    const name = `network.${network}.user.${user}.pair.${pair}.event.transfer`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.token.${}.event.transfer
  writeUserTokenTransferEventToFile = async (
    network: string,
    user: string,
    token: string,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}/transfer/token`;
    const name = `network.${network}.user.${user}.token.${token}.event.transfer`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(name, JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  // network.${}.user.${}.balancesOf
  writeUserBalancesOfToFile = async (
    network: string,
    user: string,
    index: number,
    body: any,
  ): Promise<void> => {
    const path = `${network}/user/${user}`;
    const name = `network.${network}.user.${user}.balancesOf`;
    if (fs.existsSync(`${this.dataPath}/${path}/${name}.json`)) {
      const data = await this.readArrayFromFile(path, name);
      data[index] = body;
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };
}
