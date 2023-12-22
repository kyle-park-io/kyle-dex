import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// config
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';
import { ApiModule } from './api/api.module';
// global
import { CommonModule } from './blockChain/common/common.module';
import { AccountModule } from './blockChain/account/account.module';
import { ContractModule } from './blockChain/contract/contract.module';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      load: [serverConfig],
      cache: true,
      isGlobal: true,
    }),
    // winston
    WinstonLoggerModule,
    // api
    ApiModule,
    // global
    CommonModule,
    AccountModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
