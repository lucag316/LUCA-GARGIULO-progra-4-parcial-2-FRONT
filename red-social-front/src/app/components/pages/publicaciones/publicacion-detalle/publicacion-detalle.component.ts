import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publicacion } from '../../../../core/models/publicacion.model';
import { PublicacionesService } from '../../../../services/publicaciones/publicaciones.service';
import { PublicacionComponent } from '../publicacion/publicacion.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-publicacion-detalle',
  imports: [CommonModule, FormsModule, PublicacionComponent],
  templateUrl: './publicacion-detalle.component.html',
  styleUrl: './publicacion-detalle.component.css' // opcional
})
export class PublicacionDetalleComponent implements OnInit {
  publicacion!: Publicacion;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicacionesService.getPublicacionById(id).subscribe({
        next: (pub) => {
          this.publicacion = pub;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar publicación', err);
          this.error = true;
          this.cargando = false;
        }
      });
    }
  }
}