
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';


/*

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import import { CommonModule from '@angular/common';

import 
*/

@Component({
    standalone: true,
    selector: 'app-registro',
    imports: [CommonModule, FormsModule, MatSnackBarModule],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
})
export class RegistroComponent {

    user = {
        nombre: '',
        apellido: '',
        correo: '',
        usuario: '',
        password: '',
        fechaNacimiento: '',
        descripcion: '',
        perfil: 'usuario',
        imagenPerfil: null as File | null,
    };

    confirmPassword: string = '';
    loading = false;
    selectedFile: File | null = null;

    isBrowser: boolean;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ){
        this.isBrowser = isPlatformBrowser(this.platformId);
    } 


    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input?.files && input.files.length > 0) {
            this.user.imagenPerfil = input.files[0];
        }
    }


    onRegister(): void {
        if (this.user.password !== this.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        this.loading = true;

        // Simulación o llamado real a servicio de registro:
        setTimeout(() => {
            console.log('Usuario registrado:', this.user);
            if (this.selectedFile) {
                console.log('Imagen seleccionada:', this.selectedFile.name);
            }
            this.loading = false;
        }, 1500);
    }

    esFechaValida(): boolean {
        if (!this.user.fechaNacimiento) return false;

        const fechaNacimiento = new Date(this.user.fechaNacimiento);
        const hoy = new Date();

        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        const dia = hoy.getDate() - fechaNacimiento.getDate();

        if (edad > 13) return true;
        if (edad === 13) {
            if (mes > 0) return true;
            if (mes === 0 && dia >= 0) return true;
        }

        return false;
    }

    passwordsCoinciden(): boolean {
        return this.user.password === this.confirmPassword;
    }
}
