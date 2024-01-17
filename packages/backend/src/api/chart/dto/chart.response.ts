import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { type AccountInfo } from '../../../blockChain/account/interfaces/account.interface';

export class ResponseClientDto implements AccountInfo {
  @IsString()
  readonly network!: string;

  @IsOptional()
  @IsString()
  readonly name!: string;

  @IsString()
  readonly address!: string;

  @IsString()
  readonly balance!: string;

  @IsString()
  readonly nonce!: string;
}
