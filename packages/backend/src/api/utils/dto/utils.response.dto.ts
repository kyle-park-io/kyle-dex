import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAddress } from 'src/common/decorator/custom.decorator';

export class ResponsePairDto {
  @IsString()
  @ApiProperty({
    description: 'contract name',
    example: 'pairA',
    required: true,
  })
  name!: string;

  @IsAddress('check address type', { message: 'not address type' })
  @ApiProperty({
    description: 'contract address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  address!: string;
}
