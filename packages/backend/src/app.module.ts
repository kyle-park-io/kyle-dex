import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// config
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from './common/config/server.config';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
      cache: true,
      isGlobal: true,
    }),
    WinstonLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
