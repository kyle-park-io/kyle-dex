import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class GetPairListDto {
  @IsString()
  @ApiProperty({
    description: 'network',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;
}

export class GetPairDto {
  @IsString()
  @ApiProperty({
    description: 'network',
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

export class GetClientPairDto {
  @IsString()
  @ApiProperty({
    description: 'network',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly pairAddress!: string;
}

export class GetClientDto {
  @IsString()
  @ApiProperty({
    description: 'network',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;
}
