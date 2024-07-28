import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class CalcPairDto {
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

  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'DexCalc',
    required: true,
  })
  readonly contractName!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'factory address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  factory!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenA address',
    example: '0x90b0079b4e1c58b351ba47110d11276b1ecbeeb6',
    required: true,
  })
  tokenA!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenB address',
    example: '0xa31a92ce5cf8746519aafc96186bdac73fe4ce74',
    required: true,
  })
  tokenB!: string;
}

export class Create2Dto {
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'factory address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  factory!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenA address',
    example: '0x90b0079b4e1c58b351ba47110d11276b1ecbeeb6',
    required: true,
  })
  tokenA!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'tokenB address',
    example: '0xa31a92ce5cf8746519aafc96186bdac73fe4ce74',
    required: true,
  })
  tokenB!: string;
}
