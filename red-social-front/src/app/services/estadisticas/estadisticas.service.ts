import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private baseUrl = 'http://localhost:3000/estadisticas';

  constructor(private http: HttpClient) { }

  getPublicacionesPorUsuario(desde: string, hasta: string): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.baseUrl}/publicaciones-por-usuario`, { params });
  }

  getComentariosTotales(desde: string, hasta: string): Observable<{ totalComentarios: number }> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<{ totalComentarios: number }>(`${this.baseUrl}/comentarios-totales`, { params });
  }

  getComentariosPorPublicacion(desde: string, hasta: string): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.baseUrl}/comentarios-por-publicacion`, { params });
  }
}