import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { TokenModule } from './token/token.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [CommonModule, TokenModule, UtilsModule],
})
export class ApiModule {}
