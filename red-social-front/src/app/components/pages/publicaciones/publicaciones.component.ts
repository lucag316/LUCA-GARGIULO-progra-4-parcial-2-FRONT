
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PublicacionesService } from '../../../services/publicaciones/publicaciones.service';
import { AuthService } from '../../../services/auth/auth.service';

import { Publicacion } from '../../../core/models/publicacion.model';
import { PublicacionComponent } from './publicacion/publicacion.component';

@Component({
    standalone: true,
    selector: 'app-publicaciones',
    imports: [CommonModule, FormsModule, RouterLink, PublicacionComponent],
    templateUrl: './publicaciones.component.html',
    styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent implements OnInit {
    publicaciones: Publicacion[] = [];
    orden: 'fecha' | 'likes' = 'fecha';
    offset = 0;
    limit = 10;
    cargando = false;
    hayMas = true;
    error: string | null = null;

    mostrarFormulario = false;
    nuevaPublicacion = this.getNuevaPublicacion();
    usuarioId: string | null = null;

    esAdmin: boolean = false;

    constructor(
        private publicacionesService: PublicacionesService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) { 
        this.usuarioId = this.authService.getUsuarioId();
    }

    ngOnInit(): void {
        const id = this.authService.getUsuarioId();
        if (id) {
            this.usuarioId = id;
        }

        const perfil = this.authService.getPerfilUser();
        this.esAdmin = perfil === 'administrador';

        this.cargarPublicaciones(true);
    }

    getNuevaPublicacion() {
        return {
        titulo: '',
        descripcion: '',
        imagen: null as File | null
        };
    }

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput?.files?.length) {
            this.nuevaPublicacion.imagen = fileInput.files[0];
        }
    }

    crearPublicacion(): void {
        if (!this.nuevaPublicacion.titulo || !this.nuevaPublicacion.descripcion) return;

        const formData = new FormData();
        formData.append('titulo', this.nuevaPublicacion.titulo);
        formData.append('descripcion', this.nuevaPublicacion.descripcion);
        if (this.nuevaPublicacion.imagen) {
            formData.append('imagenPost', this.nuevaPublicacion.imagen);
        }

        this.cargando = true;

        this.publicacionesService.crearPublicacion(formData).subscribe({
            next: (nueva) => {
            this.mostrarFormulario = false;
            this.nuevaPublicacion = this.getNuevaPublicacion();
            this.publicaciones.unshift(nueva); // Agregar al principio de la lista
            this.offset++; // porque agregamos uno más
            this.showMessage('✅ Publicación creada');
            },
            error: (err) => {
            this.showMessage('❌ Error al crear publicación', true);
            },
            complete: () => {
            this.cargando = false;
            }
        });
    }

    eliminarPublicacion(id: string): void {
        if (!confirm('¿Estás seguro de que querés eliminar esta publicación?')) return;

        this.cargando = true;

        this.publicacionesService.eliminarPublicacion(id).subscribe({
            next: () => {
                this.showMessage('✅ Publicación eliminada');
                this.cargando = false;     // 👈 Mover esto antes
                this.recargar();           // 👈 Ahora sí puede recargar correctamente
            },
            error: (err) => {
                const msg = err.status === 403
                    ? 'No tenés permiso para eliminar esta publicación'
                    : 'Error al eliminar publicación';
                this.showMessage(msg, true);
                this.cargando = false; // 👈 También mover esto acá
            }
        });
    }

    cambiarOrden(nuevoOrden: string): void {
        if (nuevoOrden !== 'fecha' && nuevoOrden !== 'likes') return;
        if (nuevoOrden === this.orden) return;

        this.orden = nuevoOrden;
        this.recargar();
    }
    /*cambiarOrden(nuevoOrden: string): void {
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
    }*/

    cargarPublicaciones(reiniciar = false): void {
        // ⚠️ Elimina esta línea para que no bloquee llamadas forzadas
        // if (this.cargando || !this.hayMas) return;

        if (!this.hayMas && !reiniciar) return;

        this.cargando = true;
        this.error = null;

        this.publicacionesService.getPublicaciones(this.orden, this.offset, this.limit).subscribe({
            next: (data: Publicacion[]) => {
                const nuevas = Array.isArray(data) ? data : [];

                this.publicaciones = reiniciar ? nuevas : [...this.publicaciones, ...nuevas];
                this.offset += nuevas.length;
                this.hayMas = nuevas.length === this.limit;
            },
            error: (err) => {
                this.error = 'Error al cargar publicaciones';
                console.error(err);
            },
            complete: () => {
                this.cargando = false;
            }
        });
    }


    recargar(): void {
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

    onLikeActualizado() {
  // Por ahora no hacer nada, pero se podría usar para analytics, stats, etc.
}
}
