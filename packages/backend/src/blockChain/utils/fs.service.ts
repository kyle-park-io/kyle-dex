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
    if (contractName.includes('token')) {
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
    if (path === '') {
      const data = fs.readFileSync(`${this.dataPath}/${name}`, 'utf8');
      const array = JSON.parse(data);
      return array;
    } else {
      const data = fs.readFileSync(`${this.dataPath}/${path}/${name}`, 'utf8');
      const array = JSON.parse(data);
      return array;
    }
  };

  writePairArrayToFile = async (name: string, body: any): Promise<void> => {
    if (fs.existsSync(`${this.dataPath}/${name}`)) {
      const data = await this.readArrayFromFile('', name);
      data.push(body);

      cacheService.set('pairList', JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      const data: any[] = [];
      data.push(body);

      cacheService.set('pairList', JSON.stringify(data, null, 2));
      fs.writeFileSync(
        `${this.dataPath}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  writeReserveArrayToFile = async (
    path: string,
    name: string,
    body: any,
  ): Promise<void> => {
    if (fs.existsSync(`${this.dataPath}/${path}/${name}`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(
        `pair.${name.split('.')[0]}`,
        JSON.stringify(data, null, 2),
      );
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(
        `pair.${name.split('.')[0]}`,
        JSON.stringify(data, null, 2),
      );
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  writeUserArrayToFile = async (
    path: string,
    name: string,
    body: any,
  ): Promise<void> => {
    if (fs.existsSync(`${this.dataPath}/${path}/${name}`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };

  writeUserArrayToFile2 = async (
    path: string,
    name: string,
    body: any,
  ): Promise<void> => {
    if (fs.existsSync(`${this.dataPath}/${path}/${name}`)) {
      const data = await this.readArrayFromFile(path, name);
      data[0] = body;
      data.push(body);

      cacheService.set(
        `user.${name.split('.')[0]}`,
        JSON.stringify(data, null, 2),
      );
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      fs.mkdirSync(`${this.dataPath}/${path}`, { recursive: true });

      const data: any[] = [];
      data.push(body);
      data.push(body);

      cacheService.set(
        `user.${name.split('.')[0]}`,
        JSON.stringify(data, null, 2),
      );
      fs.writeFileSync(
        `${this.dataPath}/${path}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };
}
