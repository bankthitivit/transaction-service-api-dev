
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');

        const now = Date.now();

        // console.log(Object.keys(context))
        // console.log(Object.keys(context.args))
        // console.log(context.switchToHttp().getRequest<Request>())

        return next
            .handle()
            .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
    }
}