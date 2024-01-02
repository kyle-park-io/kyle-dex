import { ApiProperty } from '@nestjs/swagger';
import { IsAddress } from '../../../common/decorator/custom.decorator';
import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
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
  readonly address!: string;
}

export class CheckTokenDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
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
  readonly address!: string;
}
