import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAddress } from 'src/common/decorator/custom.decorator';

export class QueryContractDto {
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsAddress('check address type', { message: 'not address type' })
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

export class SubmitContractDto {
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsAddress('check address type', { message: 'not address type' })
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
