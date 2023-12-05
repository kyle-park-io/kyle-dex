import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // config
  const configService = app.get(ConfigService);
  const port = configService.get<string>('server.port') as string;

  await app.listen(port);
}

void bootstrap();
