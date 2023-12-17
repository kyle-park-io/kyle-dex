import {
  type ExceptionFilter,
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class DetailedErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    const hasValidResponse =
      typeof exceptionResponse === 'object' && exceptionResponse !== null;

    response.status(status).json({
      statusCode: status,
      message,
      ...(hasValidResponse && { details: exceptionResponse }),
    });
  }
}
