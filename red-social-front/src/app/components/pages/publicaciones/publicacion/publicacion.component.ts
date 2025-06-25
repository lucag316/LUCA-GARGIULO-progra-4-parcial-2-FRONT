import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Publicacion } from '../../../../core/models/publicacion.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { PublicacionesService } from '../../../../services/publicaciones/publicaciones.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-publicacion',
    imports: [CommonModule],
    templateUrl: './publicacion.component.html',
    styleUrl: './publicacion.component.css'
})


export class PublicacionComponent {
    @Input() publicacion!: Publicacion;
    @Output() likeCambio = new EventEmitter<void>();

    usuarioId: string | null = null;
    yaDioLike = false;
    procesandoLike = false;

    constructor(
        private authService: AuthService,
        private publicacionesService: PublicacionesService
    ) {
        this.usuarioId = this.authService.getUsuarioId();
    }

    ngOnChanges(): void {
        this.verificarLike();
    }

    verificarLike() {
        if (!this.usuarioId) return;
        this.yaDioLike = this.publicacion.likes.includes(this.usuarioId);
    }

    toggleLike() {
        if (this.procesandoLike) return;

        this.procesandoLike = true;

        if (this.yaDioLike) {
        // Quitar like
        this.publicacionesService.quitarLike(this.publicacion._id)
            .subscribe({
            next: () => {
                this.yaDioLike = false;
                // Actualizamos el array localmente para no recargar todo
                this.publicacion.likes = this.publicacion.likes.filter(id => id !== this.usuarioId);
                this.likeCambio.emit();
                this.procesandoLike = false;
            },
            error: () => {
                alert('Error al quitar like'); // Mejor usar modal en producción
                this.procesandoLike = false;
            }
            });
        } else {
        // Dar like
        this.publicacionesService.darLike(this.publicacion._id)
            .subscribe({
            next: () => {
                this.yaDioLike = true;
                this.publicacion.likes.push(this.usuarioId!);
                this.likeCambio.emit();
                this.procesandoLike = false;
            },
            error: () => {
                alert('Error al dar like');
                this.procesandoLike = false;
            }
            });
        }
    }
}
