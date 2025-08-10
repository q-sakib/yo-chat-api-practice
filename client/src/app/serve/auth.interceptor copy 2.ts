import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

// --- 🔐 Auth Interceptor ---
export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // Get tokens from localStorage
  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('refresh_token');

  let authReq = req;

  // Only attach token if request goes to our API
  if (token && req.url.startsWith('/api')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        // Attempt to refresh access token
        return http
          .post('/api/refresh', null, {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // typically refresh token sent as Bearer too
            },
            observe: 'response',
          })
          .pipe(
            switchMap((res) => {
              const newAccessToken = res.headers
                .get('Authorization')
                ?.replace('Bearer ', '');
              const newRefreshToken = res.headers.get('X-Refresh-Token');

              if (!newAccessToken) {
                console.warn('[AuthInterceptor] Missing new access token');
                throw new Error('Token refresh failed');
              }

              // Store updated tokens in localStorage
              localStorage.setItem('auth_token', newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem('refresh_token', newRefreshToken);
              }

              // Retry original request with new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });

              return next(retryReq);
            }),
            catchError(() => {
              // Refresh failed — force logout
              console.warn('[AuthInterceptor] Refresh failed. Logging out.');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
              localStorage.clear();
              router.navigateByUrl('/auth/login');
              return throwError(() => new Error('Session expired'));
            })
          );
      }

      return throwError(() => error);
    })
  );
};
