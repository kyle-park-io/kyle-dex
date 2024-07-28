import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class QueryContractDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'user name',
    example: 'user1',
    required: false,
  })
  readonly userName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly userAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'tokenA',
    required: false,
  })
  readonly contractName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly contractAddress?: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsArray()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];
}

export class SubmitContractDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'user name',
    example: 'user1',
    required: false,
  })
  readonly userName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly userAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'tokenA',
    required: false,
  })
  readonly contractName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly contractAddress?: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsArray()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];
}

export class SubmitContractWithETHDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'user name',
    example: 'user1',
    required: false,
  })
  readonly userName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly userAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'tokenA',
    required: false,
  })
  readonly contractName?: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly contractAddress?: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsArray()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];

  @IsString()
  @ApiProperty({ description: 'amount of eth', example: '1' })
  readonly eth!: string;
}
