import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔐 Simple Auth Interceptor: Attach Bearer token only
export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('auth_token');

  // Only attach token to API requests (adjust base URL as needed)
  const isApiRequest = req.url.startsWith('http://localhost:8000/api');

  if (token && isApiRequest) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  }

  // Proceed without modifying if no token or not an API request
  return next(req);
};
