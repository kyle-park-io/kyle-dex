import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TokenModule } from './token/token.module';
import { UtilsModule } from './utils/utils.module';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [AuthModule, CommonModule, TokenModule, UtilsModule, ChartModule],
})
export class ApiModule {}
