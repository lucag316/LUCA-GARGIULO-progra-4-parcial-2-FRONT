import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  progress = 0;
  private progressInterval: any;
  minimumLoadingTime = 2000; // Tiempo mínimo de visualización (2 segundos)
  loadingStartTime: number;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loadingStartTime = Date.now();
  }

  ngOnInit(): void {
    // Simular progreso (opcional)
    this.simulateProgress();
    
    // Validar token
    this.validateToken();
  }

  simulateProgress(): void {
    this.progressInterval = setInterval(() => {
      if (this.progress < 90) {
        this.progress += 10;
      }
    }, 300);
  }

 validateToken(): void {
    const navigation = this.router.getCurrentNavigation();
    const fromLogin = navigation?.extras.state?.['fromLogin'];
    
    // Forzar mostrar el loading por 2 segundos incluso si la validación es rápida
    const startTime = Date.now();
    
    this.authService.verificarToken().subscribe({
        next: (isValid) => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
            
            setTimeout(() => {
                if (isValid) {
                    // Redirigir según si viene de login o recarga
                    if (fromLogin) {
                        this.router.navigate(['/publicaciones']);
                    } else if (this.router.url === '/' || this.router.url === '/loading') {
                        this.router.navigate(['/publicaciones']);
                    }
                } else {
                    this.authService.logout(); // Limpiar token inválido
                    this.router.navigate(['/login']);
                }
            }, remainingTime);
        },
        error: () => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
            
            setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
            }, remainingTime);
        }
    });
}

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}