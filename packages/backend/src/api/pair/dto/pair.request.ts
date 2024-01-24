import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class GetReserveDto {
  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly pairAddress!: string;
}
