import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseCreateTokenDto {
  @IsString()
  @ApiProperty({
    description: 'date',
    example: '2023-12-31T07:14:28.665Z',
    required: true,
  })
  expirationDate!: Date;

  @IsString()
  @ApiProperty({
    description: 'jwt',
    example: 'jwt',
    required: true,
  })
  jwt!: string;
}
