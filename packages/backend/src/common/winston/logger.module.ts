import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerInfo } from './winston-config';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggerInfo)],
})
export class WinstonLoggerModule {}
