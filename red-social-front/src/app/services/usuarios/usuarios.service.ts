import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../core/models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl = 'http://localhost:3000/users'; // Asegurate de que coincide con tu backend

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Dar de baja lógicamente un usuario
  desactivarUsuario(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Dar de alta nuevamente
  activarUsuario(id: string) {
    return this.http.post(`${this.baseUrl}/rehabilitar/${id}`, {});
  }

  // Registrar un nuevo usuario (sin login automático)
  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, {
      headers: {
        ...this.getAuthHeaders(), // tu token
        'Content-Type': 'application/json'
      }
    });
  }
}