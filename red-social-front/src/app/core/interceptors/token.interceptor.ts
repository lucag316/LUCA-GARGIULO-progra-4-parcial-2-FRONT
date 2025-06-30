import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Evitar agregar token a login y registro
  if (req.url.includes('/auth/login') || req.url.includes('/auth/registro')) {
    return next(req);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Si el backend devuelve 401, cerrar sesión y redirigir
      if (error.status === 401) {
        authService.logout(); // borra el token, limpia timers, redirige
        console.warn('Token expirado o inválido. Redirigiendo al login.');
      }
      return throwError(() => error); // importante para seguir el flujo de errores
    })
  );
};



/*import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('Interceptando request a:', req.url, 'Token:', token);

    if (token) {
      console.log('✅ Interceptor agregando token a:', req.url);
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}*/