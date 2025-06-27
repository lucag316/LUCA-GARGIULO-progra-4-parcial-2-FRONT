import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Publicacion } from '../../core/models/publicacion.model';
import { Observable } from 'rxjs';

import { of } from 'rxjs';
import { catchError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class PublicacionesService {

    private baseUrl = 'http://localhost:3000/posts';

    constructor(private http: HttpClient) { }

    /**
   * Obtiene publicaciones desde el backend, con orden y paginación
   */
    getPublicaciones(
        orden: 'fecha' | 'likes', 
        offset: number, 
        limit: number
        ): Observable<Publicacion[]> {
        const params = new HttpParams()
            .set('orden', orden)
            .set('offset', offset.toString())
            .set('limit', limit.toString());

        return this.http.get<{ posts: Publicacion[], total: number }>(this.baseUrl, { params })
            .pipe(
                map(response => response.posts || []), // Extrae el array posts
                catchError(err => {
                    console.error('Error:', err);
                    return of([]); // Devuelve array vacío si hay error
                })
            );
    }
    /**
   * Da me gusta a una publicación
   */
    darLike(publicacionId: string) {
        return this.http.post(`${this.baseUrl}/${publicacionId}/me-gusta`, {});  // Importante: "me-gusta" y no "like"
    }

    /**
   * Quita me gusta de una publicación
   */
    quitarLike(publicacionId: string) {
        return this.http.delete(`${this.baseUrl}/${publicacionId}/me-gusta`);  // Igual acá "me-gusta"
    }

    // En tu servicio de Angular
    getUserPosts(userId: string): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(`${this.baseUrl}/posts/user/${userId}`);
    }

    getUltimasPublicaciones(userId: string, limit: number = 3) {
        return this.http.get<Publicacion[]>(`http://localhost:3000/posts/user/${userId}?limit=${limit}`);
    }
}
