import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../../core/models/perfil.model';
import { Publicacion } from '../../core/models/publicacion.model';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs';


// Crear interfaces para las respuestas:
interface LoginResponse {
  data: {
    token: string;
    user: Usuario;
  };
  success: boolean;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // o tu ruta del backend

  constructor(private http: HttpClient) {}

  // ------------------------
  // 1. LOGIN: guarda token
  // ------------------------
  // Luego actualizar los métodos:
  login(datos: { correoOrUsername: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, datos).pipe(
      tap((res) => {
        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
        }
      })
    );
  }
  // ------------------------
  // 2. REGISTRO (opcional)
  // ------------------------
  // Añadir manejo de errores en register()
  register(datos: FormData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/registro`, datos).pipe(
      tap({
        next: (res) => {
          if (res.data?.token) {
            localStorage.setItem('token', res.data.token);
          }
        },
        error: (err) => {
          console.error('Error en registro:', err);
          throw err; // Propaga el error para manejo en componente
        }
      })
    );
  }

  // ------------------------
  // 3. Obtener el token
  // ------------------------
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ------------------------
  // 4. Saber si el usuario está logueado
  // ------------------------
  estaLogueado(): boolean {
    return !!this.getToken();
  }

  // ------------------------
  // 5. Decodificar payload del token
  // ------------------------
  getPayload(): { sub: string; rol: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        sub: payload.sub,
        rol: payload.perfil || payload.rol // Compatibilidad con ambos nombres
      };
    } catch (e) {
      console.error('Error decodificando token:', e);
      this.logout(); // Limpiar token inválido
      return null;
    }
  }

  // ------------------------
  // 6. Obtener ID del usuario
  // ------------------------
  getUsuarioId(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null; // "sub" es lo típico para user ID
  }

  // Método para obtener perfil del usuario logueado
  getPerfilUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/perfil`);
  }
  // Método para obtener publicaciones del usuario
  getPublicacionesUsuario(): Observable<{publicaciones: Publicacion[]}> {
    return this.http.get<{publicaciones: Publicacion[]}>(`${this.baseUrl}/mis-publicaciones`);
  }

  getCurrentUser(): Observable<Usuario> {
      return this.http.get<Usuario>(`http://localhost:3000/users/me`, {
          headers: this.getAuthHeaders()
      }).pipe(
          map(user => {
              // Si la imagen no tiene http, agregar la URL base
              // ACÁ es donde lo corregís
              if (user.imagenPerfil && !user.imagenPerfil.startsWith('http')) {
                  user.imagenPerfil = `http://localhost:3000/uploads/${user.imagenPerfil}`; // ✅ CORRECTO
              }
              return user;
          })
      );
  }
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // En tu backend usas "perfil", pero en getRol() buscas "rol"
  getRol(): string | null {
    const payload = this.getPayload();
    return  payload?.rol || null; // Más flexible
  }
  

  // ------------------------
  // 8. Logout
  // ------------------------
  logout(): void {
    localStorage.removeItem('token');
  }

  verificarToken(): Observable<{ valid: boolean, user?: any }> {
    const token = this.getToken();
    if (!token) return of({ valid: false });

    return this.http.post<{ valid: boolean, user?: any }>(
      `${this.baseUrl}/autorizar`,
      { token }
    ).pipe(
      catchError(() => of({ valid: false }))
    );
  }
}