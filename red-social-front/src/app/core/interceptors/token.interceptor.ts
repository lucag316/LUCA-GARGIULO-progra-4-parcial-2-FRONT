import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Excluir endpoints públicos
  if (req.url.includes('/auth/login') || req.url.includes('/auth/registro')) {
    return next(req);
  }

  // Manejo seguro para SSR
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Clonar request y agregar token
  const authReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // 1. Limpiar estado de autenticación
        authService.logout();
        
        // 2. Redirigir a login (según consigna)
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
        
        // 3. Opcional: Mostrar mensaje al usuario
        if (typeof window !== 'undefined') {
          authService.showMessage('Tu sesión ha expirado', true);
        }
      }
      
      // Propagamos el error para que otros manejadores puedan procesarlo
      return throwError(() => error);
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