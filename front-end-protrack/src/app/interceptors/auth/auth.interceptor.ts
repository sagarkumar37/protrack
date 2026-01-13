import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    if (this.isPublicRoute(req.url)) {
      return next.handle(req);
    }

    if (authToken) {
      if (this.tokenExpired(authToken)) {
        this.handleAuthError();
        return throwError('Token expired or invalid');
      } else {
        const clonedReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        return next.handle(clonedReq);
      }
    }
    return next.handle(req);
  }

  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = ['/login', '/register', '/attendance-regularization'];
    return publicRoutes.some((route) => url.includes(route));
  }

  private handleAuthError() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
