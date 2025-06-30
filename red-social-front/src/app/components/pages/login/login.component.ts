

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth/auth.service';

import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatSnackBarModule, CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent {
    
    identifier: string = '';
    password: string = '';

    loading: boolean = false;
    isBrowser: boolean;
    passwordFocused: boolean = false;
    passwordTouched: boolean = false;
    
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ){
        this.isBrowser = isPlatformBrowser(this.platformId);
    }




    onLogin() {
        this.identifier = this.identifier.trim();
        this.password = this.password.trim();

        if (!this.identifier || !this.password) {
            this.showMessage('Todos los campos son obligatorios.', true);
            return;
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(this.password)) {
            this.showMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.', true);
            return;
        }

        this.loading = true;

        this.authService.login({ 
            correoOrUsername: this.identifier, 
            password: this.password 
        }).subscribe({
            next: (res) => {
                this.showMessage('¡Inicio de sesión exitoso!');
                this.loading = false;
                this.router.navigate(['/publicaciones']);  // o la ruta que quieras después del login
            },
            error: (err) => {
                const msg = err.error?.message || 'Error al iniciar sesión';
                this.showMessage(msg, true);
                this.loading = false;
            }
        });
    }

    onPasswordBlur() {
        this.passwordFocused = false;
        this.passwordTouched = true;
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
