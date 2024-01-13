import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// static
import { ServeStaticModule } from '@nestjs/serve-static';
// config
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';
import { ApiModule } from './api/api.module';
// global
import { UtilsModule } from './blockChain/utils/utils.module';
import { CommonModule } from './blockChain/common/common.module';
import { AccountModule } from './blockChain/account/account.module';
import { ContractModule } from './blockChain/contract/contract.module';
import { MetamaskModule } from './blockChain/metamask/metamask.module';
import { ListenerModule } from './blockChain/listener/listener.module';
import path from 'path';

@Module({
  imports: [
    // static
    ServeStaticModule.forRoot({
      rootPath: path.resolve('build'),
    }),
    // config
    ConfigModule.forRoot({
      load: [serverConfig],
      cache: true,
      isGlobal: true,
    }),
    // winston
    WinstonLoggerModule,
    // global
    UtilsModule,
    ContractModule,
    AccountModule,
    CommonModule,
    MetamaskModule,
    ListenerModule,
    // api
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
