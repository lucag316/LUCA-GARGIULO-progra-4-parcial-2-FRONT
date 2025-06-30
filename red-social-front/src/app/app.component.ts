import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/shared/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'red-social-front';
  mostrarNavbar = true;
  mostrarFooter = true;
  mostrarLoading = false;
  minimumLoadingTime = 2000; // 2 segundos mínimo
  loadingStartTime: number;

  constructor(
    private authService: AuthService, 
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loadingStartTime = Date.now();
    this.router.events.subscribe(() => {
      this.actualizarVisibilidadComponentes();
    });
  }

  ngOnInit() {
    // Pequeño timeout para asegurar que Angular renderice el loading primero
    setTimeout(() => {
      this.verificarAutenticacionInicial();
    }, 100);
  }

  private actualizarVisibilidadComponentes() {
    const ruta = this.router.url;
    const rutasOcultar = ['/login', '/registro', '/loading'];
    const debeOcultar = rutasOcultar.some(r => ruta.includes(r));
    
    this.mostrarNavbar = !debeOcultar;
    this.mostrarFooter = !debeOcultar;
    this.cdr.detectChanges(); // Forzar actualización de vista
  }

  private verificarAutenticacionInicial() {
    const rutaActual = this.router.url;
    
    if (rutaActual === '/login' || rutaActual === '/registro') {
      return;
    }

    this.mostrarLoading = true;
    this.cdr.detectChanges(); // Forzar actualización para mostrar loading
    
    this.authService.verificarToken().subscribe({
      next: (response) => {
        const elapsed = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
        
        setTimeout(() => {
          this.mostrarLoading = false;
          this.cdr.detectChanges();
          
          if (response.valid) {
            if (rutaActual === '/' || rutaActual === '/loading') {
              this.router.navigate(['/publicaciones']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        }, remainingTime);
      },
      error: () => {
        const elapsed = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
        
        setTimeout(() => {
          this.mostrarLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/login']);
        }, remainingTime);
      }
    });
  }
}
/*
export class AppComponent implements OnInit {
  title = 'red-social-front';
  mostrarNavbar = true;
  mostrarFooter = true;
  mostrarLoading = false;

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
*/