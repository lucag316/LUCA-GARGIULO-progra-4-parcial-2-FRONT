import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Publicacion } from '../../../../core/models/publicacion.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { PublicacionesService } from '../../../../services/publicaciones/publicaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Comentario } from '../../../../core/models/comentario.model';
import { ComentariosService } from '../../../../services/comentarios/comentarios.service';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
    standalone: true,
    selector: 'app-publicacion',
    imports: [CommonModule, FormsModule, MatSpinner],
    templateUrl: './publicacion.component.html',
    styleUrl: './publicacion.component.css'
})

export class PublicacionComponent {
    @Input() publicacion!: Publicacion;
    @Input() modoDetalle: boolean = false;
    @Output() likeCambio = new EventEmitter<void>();

    usuarioId!: string;
    yaDioLike = false;
    procesandoLike = false;

    nuevoComentario: string = '';
    comentando: boolean = false;
    errorComentario: string = '';

    comentarios: Comentario[] = [];
    offset = 0;
    limit = 3;
    totalComentarios = 0;
    cargandoComentarios = false;
    usuarioActualId: string | null = null;

    hayMasComentarios = true;
    esAdmin = false;

    constructor(
        private authService: AuthService,
        private publicacionesService: PublicacionesService,
        private comentariosService: ComentariosService
    ) {}

    ngOnInit(): void {
        const id = this.authService.getUsuarioId();
        if (!id) return;
        this.usuarioId = id;
        this.usuarioActualId = id;
        this.verificarLike();

        const perfil = this.authService.getPerfilUser();
        this.esAdmin = perfil === 'administrador';

        this.cargarComentarios();
    }

    ngOnChanges(): void {
        this.verificarLike();
        this.resetearComentarios();
        this.cargarComentarios();
    }

    private resetearComentarios(): void {
        this.comentarios = [];
        this.offset = 0;
        this.hayMasComentarios = true;
    }

    verificarLike(): void {
        if (!this.usuarioId || !this.publicacion) return;
        this.yaDioLike = this.publicacion.likes.includes(this.usuarioId);
    }

    toggleLike(): void {
        if (this.procesandoLike || !this.usuarioId) return;

        const scrollY = window.scrollY;
        this.procesandoLike = true;

        const likeObservable = this.yaDioLike
            ? this.publicacionesService.quitarLike(this.publicacion._id)
            : this.publicacionesService.darLike(this.publicacion._id);

        likeObservable.subscribe({
            next: () => {
                if (this.yaDioLike) {
                    this.publicacion.likes = this.publicacion.likes.filter(id => id !== this.usuarioId);
                } else {
                    this.publicacion.likes.push(this.usuarioId);
                }

                this.yaDioLike = !this.yaDioLike;
                // Emitir solo si el padre realmente necesita saberlo (como para actualizar estadísticas)
                this.likeCambio.emit();

                // Restaurar el scroll en caso de redibujos
                setTimeout(() => window.scrollTo({ top: scrollY }), 0);
            },
            error: () => {
                alert('Error al actualizar like');
            },
            complete: () => {
                this.procesandoLike = false;
            }
        });
    }

    agregarComentario(postId: string) {
        if (!this.nuevoComentario.trim()) {
            this.errorComentario = 'El comentario no puede estar vacío';
            return;
        }

        this.comentando = true;
        this.publicacionesService.addComentario(postId, this.nuevoComentario).subscribe({
            next: (res) => {
                this.publicacion = res;
                this.nuevoComentario = '';
                this.errorComentario = '';
                this.comentando = false;
            },
            error: (err) => {
                this.errorComentario = 'Error al enviar el comentario';
                console.error(err);
                this.comentando = false;
            }
        });
    }

    cargarComentarios(): void {
        if (!this.publicacion || this.cargandoComentarios || !this.hayMasComentarios) return;

        this.cargandoComentarios = true;

        this.comentariosService.getComentarios(this.publicacion._id, this.offset, this.limit)
            .subscribe({
                next: (res) => {
                    this.comentarios = [...this.comentarios, ...res.comentarios];
                    this.offset += this.limit;
                    this.hayMasComentarios = res.comentarios.length === this.limit;
                },
                error: (err) => {
                    console.error('Error cargando comentarios:', err);
                },
                complete: () => {
                    this.cargandoComentarios = false;
                }
            });
    }

    iniciarEdicion(comentario: Comentario): void {
        comentario.editando = true;
        comentario.nuevoContenido = comentario.contenido;
    }

    cancelarEdicion(comentario: Comentario): void {
        comentario.editando = false;
    }

    guardarEdicion(comentario: Comentario): void {
        if (!comentario.nuevoContenido?.trim()) return;
        this.comentariosService.editarComentario(this.publicacion._id, comentario._id, comentario.nuevoContenido).subscribe({
            next: () => {
                comentario.contenido = comentario.nuevoContenido!;
                comentario.editando = false;
            },
            error: () => {
                alert('Error al editar comentario');
            }
        });
    }

    darDeBajaPublicacion(): void {
        if (!this.publicacion?._id) return;

        this.publicacionesService.bajaLogica(this.publicacion._id).subscribe({
            next: () => {
                alert('Publicación dada de baja correctamente');
                // Podrías emitir un evento para que el padre la remueva si querés
            },
            error: (err) => {
                alert('Error al dar de baja la publicación');
                console.error(err);
            }
        });
    }
}