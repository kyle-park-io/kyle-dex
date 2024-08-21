import {
  Module,
  type NestModule,
  type MiddlewareConsumer,
} from '@nestjs/common';
// static
import { ServeStaticModule } from '@nestjs/serve-static';
// middleware
import { SpaMiddleware } from './middleware/spa.middleware';
// eventEmitter
import { EventEmitterModule } from '@nestjs/event-emitter';
// config
import { ConfigModule, ConfigService } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';
// global
import { UtilsModule } from './blockChain/utils/utils.module';
import { BlockChainModule } from './blockChain/blockChain.module';
// metamask
import { MetamaskModule } from './blockChain/metamask/metamask.module';
// api
import { ApiModule } from './api/api.module';
import path from 'path';

@Module({
  imports: [
    // static
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => [
        {
          rootPath: path.resolve('build'),
          serveRoot: configService.get<string>('server.staticPath'),
        },
      ],
      inject: [ConfigService],
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
    // api
    ApiModule,
    // metamask
    MetamaskModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SpaMiddleware).forRoutes('*');
  }
}
