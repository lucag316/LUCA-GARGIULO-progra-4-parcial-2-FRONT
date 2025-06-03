

import { Routes } from '@angular/router';

import { PublicacionesComponent } from './components/pages/publicaciones/publicaciones.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistroComponent } from './components/pages/registro/registro.component';
import { MiPerfilComponent } from './components/pages/mi-perfil/mi-perfil.component';

export const routes: Routes = [

    {
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full',
    },
    {
        path: 'publicaciones',
        component: PublicacionesComponent,
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
        path: 'mi-perfil',
        component: MiPerfilComponent,
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
