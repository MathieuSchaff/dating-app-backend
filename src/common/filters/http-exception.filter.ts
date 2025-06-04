import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erreur interne du serveur';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || message;
        error = exceptionResponse['error'] || error;
      }
    } else if (exception.name === 'ValidationError') {
      // Erreur de validation Mongoose
      status = HttpStatus.BAD_REQUEST;
      message = 'Erreur de validation';
      error = 'Bad Request';
    } else if (
      exception.name === 'MongoServerError' &&
      exception.code === 11000
    ) {
      // Erreur de duplication MongoDB
      status = HttpStatus.CONFLICT;
      message = 'Cette ressource existe déjà';
      error = 'Conflict';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: message,
    });
  }
}
