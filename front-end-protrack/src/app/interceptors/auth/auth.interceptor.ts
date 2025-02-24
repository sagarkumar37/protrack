import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = "your-bearer-token";

    const authRequest = request.clone({
      setHeaders:{
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });
    return next.handle(request);
  }
}
