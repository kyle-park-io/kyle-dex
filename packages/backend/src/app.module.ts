import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// config
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';
import { ApiModule } from './api/api.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
