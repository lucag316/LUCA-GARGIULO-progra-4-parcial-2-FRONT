
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent {
    
    constructor(private router: Router, public authService: AuthService){}

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
