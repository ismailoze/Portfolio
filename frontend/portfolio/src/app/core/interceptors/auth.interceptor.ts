import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Token varsa header'a ekle
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // 401 Unauthorized - token expire olmuş veya geçersiz
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        
        // Refresh token varsa yenile
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap(response => {
              // Yeni token ile request'i tekrar gönder
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`
                }
              });
              return next(newReq);
            }),
            catchError(refreshError => {
              // Refresh başarısız olursa logout
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Refresh token yoksa logout
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
