import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      // Successfull response
      map(data => {
        // Get response 
        const response = context.switchToHttp().getResponse();

        // Handle void response
        if (data === undefined) {
          // Explicit status (to make visualisation easier) to allow some content / change to 204 in production
          response.status(HttpStatus.OK);
          return {
            success: true,
            status: HttpStatus.NO_CONTENT,
          };
        }

        // Handle response with data
        return {
          success: true,
          status: response.statusCode,
          data,
        };
      }),
      // Error response
      catchError(error => {
        const response = context.switchToHttp().getResponse();
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

        // Set response status equal to the error status
        response.status(status);

        return of(
          {
            success: false,
            status,
            error: error.response || error.message || 'Что-то пошло не так...',
          }
        );
      })
    );
  }
}
