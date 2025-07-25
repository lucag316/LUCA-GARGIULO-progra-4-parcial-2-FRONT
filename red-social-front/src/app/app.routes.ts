

import { Routes } from '@angular/router';

import { PublicacionesComponent } from './components/pages/publicaciones/publicaciones.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistroComponent } from './components/pages/registro/registro.component';
import { PerfilComponent } from './components/pages/perfil/perfil.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { PublicacionComponent } from './components/pages/publicaciones/publicacion/publicacion.component';
import { PublicacionDetalleComponent } from './components/pages/publicaciones/publicacion-detalle/publicacion-detalle.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { DashboardUsuariosComponent } from './components/pages/dashboard-usuarios/dashboard-usuarios.component';
import { DashboardEstadisticasComponent } from './components/pages/dashboard-estadisticas/dashboard-estadisticas.component';


export const routes: Routes = [

    {
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full',
    },
    {
        path: 'publicaciones',
        component: PublicacionesComponent,
        canActivate: [AuthGuard]
    },/*
    {
        path: 'publicaciones/:id',
        component: PublicacionComponent,
        canActivate: [AuthGuard]
    },*/
    {
        path: 'publicaciones/:id',
        component: PublicacionDetalleComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'registro',
        component: RegistroComponent,
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [AuthGuard]  
    },
    {
        path: 'loading',
        component: LoadingComponent,
    },
    {
        path: 'dashboard-usuarios',
        component: DashboardUsuariosComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'dashboard-estadisticas',
        component: DashboardEstadisticasComponent,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
