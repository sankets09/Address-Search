import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then((m) => m.RegisterComponent) },
  {
    path: 'search',
    loadComponent: () => import('./components/property-search/property-search.component').then((m) => m.PropertySearchComponent),
    canActivate: [authGuard],
  },
  {
    path: 'property/:id',
    loadComponent: () => import('./components/property-detail/property-detail.component').then((m) => m.PropertyDetailComponent),
    canActivate: [authGuard],
  },
];
