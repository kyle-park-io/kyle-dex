import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProcessContractDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsString()
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsString()
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly contractAddress!: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsString()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];
}

export class ProcessContractWithETHDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsString()
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsString()
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly contractAddress!: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsString()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];

  @IsString()
  @ApiProperty({ description: 'amount of eth', example: '1' })
  readonly eth!: string;
}
