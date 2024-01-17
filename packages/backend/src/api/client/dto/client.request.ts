import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class ClientDto {
  @IsString()
  @ApiProperty({
    description: 'network',
    example: 'hardhat',
    required: false,
  })
  readonly network!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: false,
  })
  readonly userAddress!: string;
}
