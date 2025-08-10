import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';


// --- 🍪 Cookie Helpers ---
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; expires=${expires}; SameSite=Lax; Secure`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

// --- 🔐 Auth Interceptor ---
export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const token = getCookie('auth_token');
  const refreshToken = getCookie('refresh_token');

  let authReq = req;

  // 🧠 Only attach token if request goes to our API
  if (token && req.url.startsWith('/api')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 🛑 Only handle 401 if refresh token is available
      if (error.status === 401 && refreshToken) {
        // ⚡ Attempt to refresh access token
        return http
          .post('/api/refresh', null, {
            headers: {
              'X-Refresh-Token': refreshToken,
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

              // ✅ Store updated tokens
              setCookie('auth_token', newAccessToken, 7);
              if (newRefreshToken) {
                setCookie('refresh_token', newRefreshToken, 30);
              }

              // 🔁 Retry original request with new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });

              return next(retryReq);
            }),
            catchError(() => {
              // 🔐 Refresh failed — force logout
              console.warn('[AuthInterceptor] Refresh failed. Logging out.');
              deleteCookie('auth_token');
              deleteCookie('refresh_token');
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