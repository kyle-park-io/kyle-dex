import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  @ApiProperty({
    description: 'name',
    example: 'name',
    required: true,
  })
  readonly name!: string;
}
