import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();


    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log("Request with token: ", req);  // Логируем запрос с токеном
    } else {
      // console.log("Request without token: ", req);  // Логируем запрос без токена
    }

    return next(req);
  }

