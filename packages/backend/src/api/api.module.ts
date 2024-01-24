import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TokenModule } from './token/token.module';
import { UtilsModule } from './utils/utils.module';
import { ChartModule } from './chart/chart.module';
import { ClientModule } from './client/client.module';
import { PairModule } from './pair/pair.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    TokenModule,
    UtilsModule,
    ChartModule,
    ClientModule,
    PairModule,
  ],
})
export class ApiModule {}
