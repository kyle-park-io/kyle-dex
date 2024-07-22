/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { DetailedErrorFilter } from './common/expection/exception';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import { init } from './init/init';

async function bootstrap(): Promise<void> {
  try {
    const server = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      // { cors: true },
    );

    // // cors
    // app.enableCors({
    //   origin: true,
    //   methods: '*',
    //   credentials: true,
    // });

    // helmet
    app.use(helmet({ contentSecurityPolicy: false }));

    // pipe
    app.useGlobalPipes(new ValidationPipe());

    // exception filter
    app.useGlobalFilters(new DetailedErrorFilter());

    // winston
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // swagger
    const options = new DocumentBuilder()
      .setTitle('Kyle Dex Project API  Docs')
      .setDescription('Dex API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('dex/api-docs', app, document);

    // config
    const configService = app.get(ConfigService);
    const port = configService.get<string>('server.port');
    if (port === undefined) {
      throw new Error('not exist port');
    }
    // global prefix
    const prefix = configService.get<string>('server.globalPrefix');
    if (prefix === undefined) {
      throw new Error('not exist prefix');
    }
    // app.setGlobalPrefix(prefix);

    await init();

    // start server
    console.log(`Server is running on http://localhost:${port}`);
    await app.listen(port);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void bootstrap();
