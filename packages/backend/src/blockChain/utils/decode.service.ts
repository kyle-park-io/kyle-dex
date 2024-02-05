import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FsService } from './fs.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ethers } from 'ethers';

@Injectable()
export class DecodeService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly fsService: FsService,
  ) {}

  decodeResult = async (
    ccName: string,
    fnName: string,
    data: any,
  ): Promise<object> => {
    try {
      const abi = await this.fsService.getAbi(ccName);
      const arr = Object.values(abi);

      const interface2 = new ethers.Interface(arr);
      const fn = interface2.getFunction(fnName);
      if (fn === null) {
        throw new Error('does not exist function in abi');
      }

      const result = interface2.decodeFunctionResult(fn, data);
      const obj: any = {};
      if (fn.outputs.length === 1) {
        if (fn.outputs[0].type === 'tuple') {
          fn.outputs[0].components?.forEach((output, index) => {
            const key = output.name;
            obj[key] = result[0][index].toString();
          });
        } else {
          obj[fn.name] = result.toString();
        }
        return obj;
      } else {
        for (let i = 0; i < fn.outputs.length; i++) {
          if (fn.outputs[i].type === 'tuple') {
            const data = {};
            fn.outputs[i].components?.forEach((output, index) => {
              const key = output.name;
              data[key] = result[i][index].toString();
            });
            obj[fn.outputs[i].name] = data;
          } else {
            obj[fn.outputs[i].name] = result[i].toString();
          }
        }
        return obj;
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  };

  decodeResultFromContractCall = async (
    ccName: string,
    fnName: string,
    result: any,
  ): Promise<object> => {
    try {
      const abi = await this.fsService.getAbi(ccName);
      const arr = Object.values(abi);

      const interface2 = new ethers.Interface(arr);
      const fn = interface2.getFunction(fnName);
      if (fn === null) {
        throw new Error('does not exist function in abi');
      }

      const obj: any = {};
      if (fn.outputs.length === 1) {
        if (fn.outputs[0].type === 'tuple') {
          fn.outputs[0].components?.forEach((output, index) => {
            const key = output.name;
            obj[key] = result[0][index].toString();
          });
        } else {
          obj[fn.name] = result.toString();
        }
        return obj;
      } else {
        for (let i = 0; i < fn.outputs.length; i++) {
          if (fn.outputs[i].type === 'tuple') {
            const data = {};
            fn.outputs[i].components?.forEach((output, index) => {
              const key = output.name;
              data[key] = result[i][index].toString();
            });
            obj[fn.outputs[i].name] = data;
          } else {
            obj[fn.outputs[i].name] = result[i].toString();
          }
        }
        return obj;
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  };
}
