import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { Usuario } from '../../../core/models/perfil.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-usuarios',
  templateUrl: './dashboard-usuarios.component.html',
  styleUrls: ['./dashboard-usuarios.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DashboardUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  form: FormGroup;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: [''],
      apellido: [''],
      username: [''],
      email: [''], // ← antes era 'correo'
      password: [''],
      perfil: ['usuario'],
      fechaNacimiento: [''] // ← este campo es obligatorio en el backend
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  cambiarEstado(usuario: Usuario): void {
  // Si está activo (isActive = true), hacemos baja (desactivar)
  // Si no está activo, hacemos alta (activar)
  const metodo = usuario.isActive
    ? this.usuariosService.desactivarUsuario(usuario._id)
    : this.usuariosService.activarUsuario(usuario._id);

  metodo.subscribe(() => {
    this.cargarUsuarios();
  });
}

  registrarUsuario(): void {
    const datos = this.form.value; // ya es un objeto plano
    this.usuariosService.registrarUsuario(datos).subscribe(() => {
      this.form.reset();
      this.cargarUsuarios();
    });
  }
}