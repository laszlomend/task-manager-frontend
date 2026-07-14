import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => req.url.includes(path));
  const accessToken = authService.getAccessToken();

  const authorizedReq =
    accessToken && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isAuthEndpoint &&
        accessToken
      ) {
        return authService.refresh().pipe(
          switchMap((refreshed) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${refreshed.accessToken}` },
            });
            return next(retriedReq);
          }),
          catchError((refreshError: unknown) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
