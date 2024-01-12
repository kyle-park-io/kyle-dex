/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import fs from 'fs';
import path from 'path';

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

  readArrayFromFile = async (name: string): Promise<any> => {
    const data = fs.readFileSync(`${this.dataPath}/${name}`, 'utf8');
    const array = JSON.parse(data);
    return array;
  };

  writeArrayToFile = async (name: string, body: any): Promise<void> => {
    if (fs.existsSync(`${this.dataPath}/${name}`)) {
      const data = await this.readArrayFromFile(name);
      data.push(body);

      fs.writeFileSync(
        `${this.dataPath}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    } else {
      const data: any[] = [];
      data.push(body);

      fs.writeFileSync(
        `${this.dataPath}/${name}`,
        JSON.stringify(data, null, 2),
        'utf8',
      );
    }
  };
}
