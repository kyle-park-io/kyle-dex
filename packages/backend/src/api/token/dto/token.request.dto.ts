import { ApiProperty } from '@nestjs/swagger';
import { IsAddress } from 'src/common/decorator/custom.decorator';
import { IsOptional, IsString } from 'class-validator';

export class BalanceOfDto {
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'user address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly userAddress!: string;

  @IsOptional()
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'contract address',
    example: '0x88727B4a826b52414567C3E1F9aE8a3d1CE0c3eB',
    required: false,
  })
  contractAddress?: string;

  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'tokenA',
    required: true,
  })
  name!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'address',
    example: '0xfef705700f04ccb3c722d12ba8217fc0b50529ac',
    required: true,
  })
  address!: string;
}
