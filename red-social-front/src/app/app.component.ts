import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],  // No HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'red-social-front';

  constructor(private authService: AuthService, private router: Router) {
    //(window as any).authService = authService; // expongo el servicio en la consola(puedo probar desde ahi)
  
  }
  ngOnInit() {
    // Si no estás logueado y no estás en login o registro, redirigí a login
    const estaLogueado = this.authService.estaLogueado();
    const rutaActual = this.router.url;

    if (!estaLogueado && rutaActual !== '/login' && rutaActual !== '/registro') {
      this.router.navigate(['/login']);
    }
  }
}
