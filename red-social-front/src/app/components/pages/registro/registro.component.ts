
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';

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
            this.showMessage('Las contraseñas no coinciden', true);
            return;
        }

        if (!this.esFechaValida()) {
            this.showMessage('Debes tener al menos 13 años para registrarte', true);
            return;
        }

        this.loading = true;

        // Preparo FormData para enviar archivo junto a los datos
        const formData = new FormData();
        formData.append('nombre', this.user.nombre);
        formData.append('apellido', this.user.apellido);
        formData.append('correo', this.user.correo);
        formData.append('usuario', this.user.usuario);
        formData.append('contraseña', this.user.password);
        formData.append('fechaNacimiento', this.user.fechaNacimiento);
        formData.append('descripcion', this.user.descripcion);
        formData.append('perfil', this.user.perfil);

        if (this.user.imagenPerfil) {
            formData.append('imagenPerfil', this.user.imagenPerfil, this.user.imagenPerfil.name);
        }

        this.authService.register(formData).subscribe({
            next: (res) => {
                this.showMessage('Registro exitoso');
                this.loading = false;
                this.router.navigate(['/login']); // o a donde quieras redirigir
            },
            error: (err) => {
                const msg = err.error?.message || 'Error en el registro';
                this.showMessage(msg, true);
                this.loading = false;
            }
        });
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

    showMessage(message: string, isError: boolean = false) {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: isError ? 'snackbar-error' : 'snackbar-success'
        });
    }
}
