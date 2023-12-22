import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import fs from 'fs';
import path from 'path';

@Injectable()
export class FsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  getAbi = async (contractName: string): Promise<object> => {
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
}
