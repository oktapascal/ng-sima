import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/auth.component').then((mod) => mod.AuthComponent)
    },
    {
        path: 'dashboard-home',
        component: PrivateLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard-home/dashboard-home.component').then((mod) => mod.DashboardHomeComponent)
            }
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
