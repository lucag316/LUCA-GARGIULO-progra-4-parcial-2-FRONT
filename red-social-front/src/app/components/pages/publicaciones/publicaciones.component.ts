import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { PublicacionesService } from '../../../services/publicaciones/publicaciones.service';
import { Publicacion } from '../../../core/models/publicacion.model';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionComponent } from './publicacion/publicacion.component';

@Component({
    standalone: true,
    selector: 'app-publicaciones',
    imports: [CommonModule, FormsModule, PublicacionComponent],
    templateUrl: './publicaciones.component.html',
    styleUrl: './publicaciones.component.css'
})


export class PublicacionesComponent implements OnInit{


    publicaciones: Publicacion[] = [];
    orden: 'fecha' | 'likes' = 'fecha'; // orden por defecto
    offset = 0;
    limit = 5; // cantidad de publicaciones por página
    cargando = false;
    error: string | null = null;
    hayMas = true; // para paginación

    constructor(private publicacionesService: PublicacionesService) { }

    ngOnInit(): void {
        this.cargarPublicaciones(true);
    }

    cambiarOrden(nuevoOrden: string) {
        if (nuevoOrden !== 'fecha' && nuevoOrden !== 'likes') return;
        if (this.orden === nuevoOrden) return;

        this.orden = nuevoOrden;
        this.offset = 0;
        this.hayMas = true;
        this.publicaciones = [];
        this.cargarPublicaciones(true);
    }


    cargarPublicaciones(reiniciar: boolean = false) {
        if (this.cargando || !this.hayMas) return;

        this.cargando = true;
        this.error = null;

        this.publicacionesService.getPublicaciones(this.orden, this.offset, this.limit)
            .subscribe({
                next: (data) => {
                    if (reiniciar) this.publicaciones = [];
                    this.publicaciones.push(...data);
                    this.offset += data.length;
                    this.hayMas = data.length === this.limit; // si trajimos menos que limit, no hay más
                    this.cargando = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar publicaciones.';
                    this.cargando = false;
                }
        });
    }


    recargar() {
        this.offset = 0;
        this.hayMas = true;
        this.publicaciones = [];
        this.cargarPublicaciones(true);
    }


}