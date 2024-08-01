import { HttpInterceptorFn } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../_services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let errorMsg = '';

      if (error.status === 401) {
        errorMsg = 'Сессия истекла. Пожалуйста, войдите снова.';
        toastr.error(errorMsg);
        authService.logout();
        router.navigate(['']);
      } else if (error.status === 0) {
        errorMsg = 'Ошибка сети. Проверьте подключение к интернету.';
        toastr.error(errorMsg);
      } else {
        errorMsg = 'Произошла ошибка. Попробуйте еще раз.';
        toastr.error(errorMsg);
      }

      return throwError(() => new Error(errorMsg));
    })
  );
};
