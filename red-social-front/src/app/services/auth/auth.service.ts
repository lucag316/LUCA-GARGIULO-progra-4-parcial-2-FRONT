import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // o tu ruta del backend

  constructor(private http: HttpClient) {}

  // ------------------------
  // 1. LOGIN: guarda token
  // ------------------------
  login(datos: { correoOrUsername: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, datos).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.data.token); // ojo que el token está dentro de res.data.token según tu backend
      })
    );
  }

  // ------------------------
  // 2. REGISTRO (opcional)
  // ------------------------
  register(datos: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro`, datos).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.data.token); 
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
  getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Token inválido:', e);
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

  // ------------------------
  // 7. Obtener el rol (usuario / admin)
  // ------------------------
  getRol(): string | null {
    const payload = this.getPayload();
    return payload?.rol || null;
  }

  // ------------------------
  // 8. Logout
  // ------------------------
  logout(): void {
    localStorage.removeItem('token');
  }
}