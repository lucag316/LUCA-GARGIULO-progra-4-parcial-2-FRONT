import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private baseUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getComentarios(postId: string, offset = 0, limit = 3): Observable<any> {
    return this.http.get(`${this.baseUrl}/${postId}/comentarios?offset=${offset}&limit=${limit}`);
  }

  editarComentario(postId: string, comentarioId: string, contenido: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${postId}/comentarios/${comentarioId}`, { contenido });
  }
}