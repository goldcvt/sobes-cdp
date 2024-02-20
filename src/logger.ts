import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const data = {...request.body, ...request.query, ...request.params};
    console.log(`${new Date}: ${request.url} params: ${JSON.stringify(data)}`)
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Diff ${Date.now() - now}ms`)),
      );
  }
}