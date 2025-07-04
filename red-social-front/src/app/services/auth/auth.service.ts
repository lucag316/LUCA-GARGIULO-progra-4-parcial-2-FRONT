import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';
import { Usuario } from '../../core/models/perfil.model';
import { Publicacion } from '../../core/models/publicacion.model';
import { Router } from '@angular/router';
import { ModalRenovarSessionComponent } from '../../components/shared/modal-renovar-session/modal-renovar-session.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  private warningTimer: any; // 🆕 10 min
  private logoutTimer: any;  // 🆕 15 min

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  // ------------------------
  // 1. LOGIN: guarda token
  // ------------------------
  // Luego actualizar los métodos:
  login(datos: { correoOrUsername: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, datos).pipe(
      tap((res) => {
        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
          this.iniciarContadoresSesion(); // 🆕 importante
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
            this.iniciarContadoresSesion(); // 🆕 importante
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
    return this.http.get<Usuario>(`${this.baseUrl}/perfil`, {
      headers: this.getAuthHeaders()
    });
  }


  getPerfilUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.perfil; // <-- esto usalo en el front
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
  getUsuarioActual(): { id: string; perfil: string } | null {
  const payload = this.getPayload();
  if (!payload) return null;

  return {
    id: payload.sub,
    perfil: payload.rol // o 'perfil', depende del token
  };
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
    this.detenerContadoresSesion(); // 🆕
    this.router.navigate(['/login']); // 🆕
  }

  verificarToken(): Observable<{ valid: boolean, user?: any }> {
    const token = this.getToken();
    if (!token) return of({ valid: false });

    return this.http.post<{ valid: boolean, user?: any }>(
      `${this.baseUrl}/autorizar`,
      {},
      { headers: this.getAuthHeaders() } // 🆕
    ).pipe(
      catchError(() => of({ valid: false }))
    );
  }

  // 🆕 ---------------------------
  // TEMPORIZADORES DE SESIÓN
  // -----------------------------

  iniciarContadoresSesion(): void {
    this.detenerContadoresSesion(); // limpiar anteriores

    // ⏰ A los 10 min (600.000 ms) → mostrar modal
    this.warningTimer = setTimeout(() => {
      this.abrirModalRenovacion();
    }, 10 *60 * 1000);

    // ❌ A los 15 min (900.000 ms) → logout directo
    this.logoutTimer = setTimeout(() => {
      this.showMessage('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', true);
      this.logout();
    }, 15 * 60 * 1000);
  }

  detenerContadoresSesion(): void {
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);
  }

  // 🆕 ------------------------
  // REFRESCAR TOKEN
  // ------------------------
  refrescarToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/refrescar`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }


  showMessage(message: string, isError: boolean = false) {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: isError ? 'snackbar-error' : 'snackbar-success'
        });
    }
  // 🆕 --------------------------
  // MOSTRAR AVISO DE RENOVACIÓN
  // --------------------------
  abrirModalRenovacion(): void {
    const dialogRef = this.dialog.open(ModalRenovarSessionComponent);
    
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      if (resultado) {
        this.refrescarToken().subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.iniciarContadoresSesion(); // Reinicia contadores
          },
          error: () => this.logout()
        });
      }
    });
  }
}