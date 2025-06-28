import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from '../../../services/publicaciones/publicaciones.service';
import { Publicacion } from '../../../core/models/publicacion.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionComponent } from './publicacion/publicacion.component';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-publicaciones',
    imports: [CommonModule, FormsModule, PublicacionComponent, RouterLink],
    templateUrl: './publicaciones.component.html',
    styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent implements OnInit {
    publicaciones: Publicacion[] = [];
    orden: 'fecha' | 'likes' = 'fecha';
    offset = 0;
    limit = 10;
    cargando = false;
    error: string | null = null;
    hayMas = true;

    
    mostrarFormulario = false;
    nuevaPublicacion = {
        titulo: '',
        descripcion: '',
        imagen: null as File | null
    };
    
    usuarioId: string | null = null;

    constructor(
        private publicacionesService: PublicacionesService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) { 
        this.usuarioId = this.authService.getUsuarioId();
    }

    ngOnInit(): void {
        this.cargarPublicaciones(true);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
            if (input?.files && input.files.length > 0) {
                this.nuevaPublicacion.imagen = input.files[0];
            }
    }

    
    crearPublicacion(): void {
        if (!this.nuevaPublicacion.titulo || !this.nuevaPublicacion.descripcion) return;

        const formData = new FormData();
        formData.append('titulo', this.nuevaPublicacion.titulo);
        formData.append('descripcion', this.nuevaPublicacion.descripcion);

        if (this.nuevaPublicacion.imagen) {
            formData.append('imagenPost', this.nuevaPublicacion.imagen); // <- mismo nombre que en el backend
        }

        this.cargando = true;

        this.publicacionesService.crearPublicacion(formData).subscribe({
            next: () => {
                this.mostrarFormulario = false;
                this.nuevaPublicacion = { titulo: '', descripcion: '', imagen: null };
                this.recargar(); // actualiza la lista
            },
            error: (err) => {
                this.error = 'Error al crear publicación';
                this.cargando = false;
                console.error(err);
            },
            complete: () => {
                this.cargando = false;
            }
        });
    }

    eliminarPublicacion(id: string) {
        if (!confirm('¿Estás seguro de que querés eliminar esta publicación?')) return;

        this.cargando = true;
        this.publicacionesService.eliminarPublicacion(id).subscribe({
            next: () => {
                this.showMessage('Publicación eliminada');
                this.recargar(); // recargar lista
            },
            error: (err) => {
                if (err.status === 403) {
                    this.showMessage('No tienes permiso para eliminar esta publicación', true);
                } else {
                    this.showMessage('Error al eliminar publicación', true);
                }
                console.error(err);
            },
            complete: () => (this.cargando = false)
        });
    }

    cambiarOrden(nuevoOrden: string) {
        // Validación segura del tipo
        if (nuevoOrden !== 'fecha' && nuevoOrden !== 'likes') {
            console.error('Valor de orden no válido:', nuevoOrden);
            return;
        }
        
        // Conversión de tipo
        const ordenValidado = nuevoOrden as 'fecha' | 'likes';
        
        if (this.orden === ordenValidado) return;

        this.orden = ordenValidado;
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
                next: (data: Publicacion[]) => {
                    // Verificación EXTRA segura
                    const nuevasPublicaciones = Array.isArray(data) ? data : [];
                    
                    if (reiniciar) {
                        this.publicaciones = nuevasPublicaciones;
                    } else {
                        this.publicaciones = [...this.publicaciones, ...nuevasPublicaciones];
                    }
                    
                    this.offset += nuevasPublicaciones.length;
                    this.hayMas = nuevasPublicaciones.length === this.limit;
                    this.cargando = false;
                },
            error: (err) => {
                this.error = 'Error al cargar publicaciones';
                this.cargando = false;
                console.error('Error completo:', err);
            }
        });
    }
    recargar() {
        this.offset = 0;
        this.hayMas = true;
        this.publicaciones = [];
        this.cargarPublicaciones(true);
    }
    showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }
}
/*
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


}*/