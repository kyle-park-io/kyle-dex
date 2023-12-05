import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// winston
import { WinstonLoggerModule } from './common/winston/logger.module';

@Module({
  imports: [WinstonLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
