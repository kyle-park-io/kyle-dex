import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { IsAddress } from '../../../common/decorator/custom.decorator';

export class GetDto {
  @IsString()
  @ApiProperty({
    description: 'name',
    example: 'name',
    required: true,
  })
  readonly name!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  readonly address!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'extra',
    example: 'extra',
    required: false,
  })
  readonly extra?: string;
}
