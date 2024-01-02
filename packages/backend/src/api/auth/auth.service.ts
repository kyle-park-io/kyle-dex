import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtService } from '@nestjs/jwt';
import { type JWT } from './interfaces/auth.interface';
import {
  type CreateTokenDto,
  type CheckTokenDto,
} from './dto/auth.request.dto';
import { type ResponseCreateTokenDto } from './dto/auth.response.dto';

@Injectable()
export class AuthService {
  // map
  private readonly tokenMap: Map<string, JWT>;

  constructor(
    // config
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenMap = new Map<string, JWT>();
  }

  async createToken(dto: CreateTokenDto): Promise<ResponseCreateTokenDto> {
    try {
      const tM = this.tokenMap.get(dto.network + dto.address);
      console.log(tM);
      if (tM !== undefined) {
        throw new Error('jwt is already existed');
      }

      const payload = { network: dto.network, address: dto.address };
      const token = await this.jwtService.signAsync(payload);
      console.log(token);

      const eD = new Date();
      eD.setHours(eD.getHours() + 2);
      const jwt: JWT = { expirationDate: eD };

      this.tokenMap.set(dto.network + dto.address, jwt);
      return {
        expirationDate: eD,
        jwt: token,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async checkToken(dto: CheckTokenDto): Promise<JWT> {
    try {
      const token = this.tokenMap.get(dto.network + dto.address);
      if (token === undefined) {
        throw new Error('jwt is not existed');
      }
      return token;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
