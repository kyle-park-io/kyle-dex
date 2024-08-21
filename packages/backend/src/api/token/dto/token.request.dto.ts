import { ApiProperty } from '@nestjs/swagger';
import { IsAddress } from '../../../common/decorator/custom.decorator';
import { IsOptional, IsString } from 'class-validator';

export class BalanceOfDto {
  @IsString()
  @ApiProperty({
    description: 'network name',
    example: 'hardhat',
    required: true,
  })
  readonly network!: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   description: 'user name',
  //   example: 'user1',
  //   required: false,
  // })
  // readonly userName?: string;

  // @IsOptional()
  // @IsAddress('check address type', { message: 'not address type' })
  // @ApiProperty({
  //   description: 'user address',
  //   example: '0x0000000000000000000000000000000000000000',
  //   required: false,
  // })
  // readonly userAddress?: string;

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
    example: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    required: false,
  })
  readonly contractAddress?: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'address',
    example: '0xfef705700f04ccb3c722d12ba8217fc0b50529ac',
    required: true,
  })
  address!: string;
}
