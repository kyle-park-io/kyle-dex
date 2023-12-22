import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseBalanceOfDto {
  @IsString()
  @ApiProperty({
    description: 'balance',
    example: '1000',
    required: true,
  })
  amount!: string;
}
