import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class GetReserveDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly pairAddress!: string;
}

export class GetTokensDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly pairAddress!: string;
}

export class EstimateLiquidityDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'pair address',
    example: '0x6Ca2881e49b9F73C2A6814874463FDc3e2967EB9',
    required: true,
  })
  pair!: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenA address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  tokenA?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'tokenA amount',
    example: '100',
    required: false,
  })
  amountA?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenB address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  tokenB?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'tokenB amount',
    example: '1000',
    required: false,
  })
  amountB?: string;
}
