import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// static
import { ServeStaticModule } from '@nestjs/serve-static';
// middleware
import { SpaMiddleware } from './middleware/spa.middleware';
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
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpaMiddleware).forRoutes('*');
  }
}
