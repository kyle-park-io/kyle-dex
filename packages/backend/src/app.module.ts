import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// static
import { ServeStaticModule } from '@nestjs/serve-static';
// eventEmitter
import { EventEmitterModule } from '@nestjs/event-emitter';
// config
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';
// global
import { UtilsModule } from './blockChain/utils/utils.module';
import { BlockChainModule } from './blockChain/blockChain.module';
// listener
import { ListenerModule } from './blockChain/listener/listener.module';
import { MetamaskModule } from './blockChain/metamask/metamask.module';
// api
import { ApiModule } from './api/api.module';
import path from 'path';

@Module({
  imports: [
    // static
    ServeStaticModule.forRoot({
      rootPath: path.resolve('build'),
    }),
    // eventEmitter
    EventEmitterModule.forRoot(),
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
    BlockChainModule,
    // listener
    ListenerModule,
    // api
    ApiModule,
    // metamask
    MetamaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
