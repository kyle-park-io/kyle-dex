import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseReserveDto {
  @IsString()
  @ApiProperty({
    description: 'reserve tokenA',
    example: '100',
    required: true,
  })
  reserveA!: string;

  @IsString()
  @ApiProperty({
    description: 'reserve tokenB',
    example: '100',
    required: true,
  })
  reserveB!: string;
}

export class ResponseTokensDto {
  @IsString()
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  pair!: string;

  @IsString()
  @ApiProperty({
    description: 'tokenA address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  tokenA!: string;

  @IsString()
  @ApiProperty({
    description: 'tokenB address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  tokenB!: string;
}

export class ResponseEstimateLiquidityDto {
  @IsString()
  @ApiProperty({
    description: 'pair address',
    example: '0x0000000000000000000000000000000000000000',
    required: true,
  })
  pair!: string;

  @IsString()
  @ApiProperty({
    description: 'tokenA address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  tokenA!: string;

  @IsString()
  @ApiProperty({
    description: 'tokenB address',
    example: '0x55ed5701f043b5376ea1764cafaa8045cc771f20',
    required: true,
  })
  tokenB!: string;
}
