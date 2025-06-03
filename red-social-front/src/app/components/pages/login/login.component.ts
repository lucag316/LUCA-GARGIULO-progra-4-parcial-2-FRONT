

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatSnackBarModule, CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent {
    
    identifier: string = '';
    password: string = '';

    loading: boolean = false;
    isBrowser: boolean;
    
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ){
        this.isBrowser = isPlatformBrowser(this.platformId);
    }




    async onLogin() {
        /*if (!this.identifier || !this.password) {
            this.showMessage('Todos los campos son obligatorios.', true);
            return;
        }

        // Valida patrón de contraseña manualmente (en caso que Angular no lo hiciera bien)
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(this.password)) {
            this.showMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.', true);
            return;
        }

        this.loading = true;

        try {
            const { error, user } = await this.authService.login(this.identifier, this.password);
            
            if (error) {
                // Aquí puedes chequear errores más específicos según el backend
                if (error.message.includes('Unauthorized')) {
                    this.showMessage('Usuario o contraseña incorrectos.', true);
                } else {
                    this.showMessage('Error al iniciar sesión: ' + error.message, true);
                }
                this.loading = false;
                return;
            }

            this.showMessage('¡Inicio de sesión exitoso!');
            this.router.navigate(['/home']);

        } catch (err: any) {
            this.showMessage('Error inesperado: ' + err.message, true);
        } finally {
            this.loading = false;
        }*/
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
