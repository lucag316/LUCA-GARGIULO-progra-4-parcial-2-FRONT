
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { PublicacionesService } from '../../../services/publicaciones/publicaciones.service';
import { Usuario } from '../../../core/models/perfil.model';
import { Publicacion } from '../../../core/models/publicacion.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, MatIcon, MatSpinner],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})



export class PerfilComponent implements OnInit{

  usuario: Usuario | null = null;
  publicaciones: Publicacion[] = [];
  cargando = true;
  error = '';

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
      const payload = this.authService.getPayload();
      if (!payload?.sub) {
          this.showMessage('No se encontró el ID del usuario', true);
          this.cargando = false;
          return;
      }

      // Obtener datos actualizados del backend
      this.authService.getCurrentUser().subscribe({
          next: (usuario) => {
              this.usuario = usuario;
              console.log('Usuario recibido:', usuario);
              // Cargar publicaciones
              this.publicacionesService.getUltimasPublicaciones(payload.sub, 3).subscribe({
                  next: (res) => {
                      this.publicaciones = res;
                      this.cargando = false;
                  },
                  error: (err) => {
                      console.error('Error:', err);
                      this.cargando = false;
                      this.showMessage('Error al cargar publicaciones', true);
                  }
              });
          },
          error: (err) => {
              console.error('Error al cargar usuario:', err);
              this.cargando = false;
              this.showMessage('Error al cargar perfil', true);
          }
      });
  }

  getEdad(): number | null {
    if (!this.usuario?.fechaNacimiento) return null;
    const nacimiento = new Date(this.usuario.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
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