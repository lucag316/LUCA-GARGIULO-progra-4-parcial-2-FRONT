import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token de localStorage (solo en entorno browser)
  let token: string | null = null;
  
  if (typeof window !== 'undefined') { // Verificación SSR-safe
    token = localStorage.getItem('token');
  }

  // 2. Clonar la request para añadir el header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Token añadido a la solicitud:', clonedReq.url); // Debug
    return next(clonedReq);
  }

  // 3. Si no hay token, continuar con la request original
  return next(req);
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