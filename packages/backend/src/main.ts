import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { DetailedErrorFilter } from './common/expection/exception';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule, { cors: true });

    // cors
    app.enableCors({
      origin: true,
      methods: '*',
      credentials: true,
    });

    // helmet
    app.use(helmet({ contentSecurityPolicy: false }));

    // pipe
    // app.useGlobalPipes(new ValidationPipe());

    // exception filter
    app.useGlobalFilters(new DetailedErrorFilter());

    // winston
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // swagger
    app.setGlobalPrefix('api');
    const options = new DocumentBuilder()
      .setTitle('Kyle Dex Project API  Docs')
      .setDescription('Dex API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);

    // config
    const configService = app.get(ConfigService);
    const port = configService.get<string>('server.port');
    if (port === undefined) {
      throw new Error('not exist port');
    }

    // start server
    await app.listen(port);
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

void bootstrap();
