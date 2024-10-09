import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    };

    if (status === HttpStatus.UNPROCESSABLE_ENTITY && exception instanceof HttpException) {
      const validationErrors = exception.getResponse() as any;
      if (validationErrors.errors) {
        errorResponse.message = validationErrors.errors.map((error: ValidationError) => ({
          property: error.property,
          constraints: error.constraints,
        }));
      }
    }

    this.logger.error(`HTTP Error: ${JSON.stringify(errorResponse)}`);
    response.status(status).json(errorResponse);
  }
}
