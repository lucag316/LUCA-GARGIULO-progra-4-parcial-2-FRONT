import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Publicacion } from '../../core/models/publicacion.model';
import { Observable } from 'rxjs';

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

        console.log(`GET ${this.baseUrl}?orden=${orden}&offset=${offset}&limit=${limit}`);
        return this.http.get<Publicacion[]>(this.baseUrl, { params });
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




}
