import { utilities, WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

const dailyOption = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `./logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(process.env.NODE_ENV, {
        colors: false,
        prettyPrint: true,
      }),
    ),
  };
};

export const loggerInfo = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    new DailyRotateFile(dailyOption('info')),
    new DailyRotateFile(dailyOption('error')),
    new DailyRotateFile(dailyOption('warn')),
    new DailyRotateFile(dailyOption('debug')),
    new DailyRotateFile(dailyOption('verbose')),
  ],
};

export const logger = WinstonModule.createLogger(loggerInfo);
