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

    usuarioId!: string;
    yaDioLike = false;
    procesandoLike = false;

    constructor(
        private authService: AuthService,
        private publicacionesService: PublicacionesService
    ) {}

    ngOnInit(): void {
        const id = this.authService.getUsuarioId();
        if (!id) return; // Por seguridad
        this.usuarioId = id;
        this.verificarLike();
    }

    ngOnChanges(): void {
        this.verificarLike();
    }

    verificarLike(): void {
        if (!this.usuarioId || !this.publicacion) return;
        this.yaDioLike = this.publicacion.likes.includes(this.usuarioId);
    }

    toggleLike(): void {
        if (this.procesandoLike || !this.usuarioId) return;

        this.procesandoLike = true;

        if (this.yaDioLike) {
            this.publicacionesService.quitarLike(this.publicacion._id).subscribe({
                next: () => {
                    this.yaDioLike = false;
                    this.publicacion.likes = this.publicacion.likes.filter(id => id !== this.usuarioId);
                    this.likeCambio.emit();
                    this.procesandoLike = false;
                },
                error: () => {
                    alert('Error al quitar like');
                    this.procesandoLike = false;
                }
            });
        } else {
            this.publicacionesService.darLike(this.publicacion._id).subscribe({
                next: () => {
                    this.yaDioLike = true;
                    this.publicacion.likes.push(this.usuarioId);
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
