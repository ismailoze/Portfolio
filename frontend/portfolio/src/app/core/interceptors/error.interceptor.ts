import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'errors.networkError';

      if (error.error instanceof ErrorEvent) {
        console.error('Client error:', error.error.message);
        errorMessage = 'errors.networkError';
      } else {
        console.error(`Error Status: ${error.status}`);
        console.error('Error Body:', error.error);

        switch (error.status) {
          case 400:
            errorMessage = error.error?.error || 'errors.badRequest';
            break;
          case 401:
            errorMessage = 'errors.unauthorized';
            break;
          case 403:
            errorMessage = 'errors.forbidden';
            break;
          case 404:
            errorMessage = 'errors.notFound';
            break;
          case 500:
            errorMessage = 'errors.500';
            break;
          default:
            errorMessage = error.error?.error || 'errors.networkError';
        }
      }

      toastService.showError(errorMessage);

      return throwError(() => ({
        ...error,
        userMessage: errorMessage
      }));
    })
  );
};
