import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],  // No HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class AppComponent {
  title = 'red-social-front';

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.estaLogueado()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/publicaciones']);
    }
  }
}