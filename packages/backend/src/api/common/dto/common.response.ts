import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseCreateTransactionDto {
  @IsString()
  @ApiProperty({ description: 'transaction id (hex)' })
  readonly txId!: string;
}
