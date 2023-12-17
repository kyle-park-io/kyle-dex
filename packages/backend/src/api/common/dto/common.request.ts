import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QueryContract {
  @IsString()
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly address!: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsString()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];
}

export class SubmitContractTransaction {
  @IsString()
  @ApiProperty({
    description: 'contract address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly address!: string;

  @IsString()
  @ApiProperty({ description: 'function name', example: 'balanceOf' })
  readonly function!: string;

  @IsString()
  @ApiProperty({ description: 'function arguments' })
  readonly args!: any[];
}
