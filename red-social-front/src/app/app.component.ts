import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],  // No HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'red-social-front';
  mostrarNavbar = true;
  mostrarFooter = true;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      const ruta = this.router.url;
      const enLogin = ruta.includes('/login');
      const enRegistro = ruta.includes('/registro');
      this.mostrarNavbar = !(enLogin || enRegistro);
      this.mostrarFooter = !(enLogin || enRegistro);
    });
  }

  ngOnInit() {
    // Si no estás logueado y no estás en login o registro, redirigí a login
    const estaLogueado = this.authService.estaLogueado();
    const rutaActual = this.router.url;

    if (!estaLogueado && rutaActual !== '/login' && rutaActual !== '/registro') {
      this.router.navigate(['/login']);
    }
    this.verificarAutenticacion();
  }

  verificarAutenticacion() {
    this.authService.verificarToken().subscribe({
      next: (response) => {
        if (response.valid) {
          this.router.navigate(['/publicaciones']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
