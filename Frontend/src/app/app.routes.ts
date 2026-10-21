import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { majstorGuard } from './guards/majstor.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
  { path: '', loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'majstor/register', loadComponent: () => import('./pages/majstor-register/majstor-register.component').then(m => m.MajstorRegisterComponent) },
  { path: 'majstor/edit-profile/:id', loadComponent: () => import('./pages/majstor-edit-profile/majstor-edit-profile.component').then(m => m.MajstorEditProfileComponent) },
  { path: 'majstor/delete-profile/:id', loadComponent: () => import('./pages/majstor-delete-profile/majstor-delete-profile.component').then(m => m.MajstorDeleteProfileComponent) },
  { path: 'majstor/:id', loadComponent: () => import('./pages/majstor-profil/majstor-profil.component').then(m => m.MajstorProfilComponent) },
  { path: 'majstor', loadComponent: () => import('./pages/landing-majstor/landing-majstor.component').then(m => m.LandingMajstorComponent) },
  { path: 'majstor-map', loadComponent: () => import('./pages/majstor-map/majstor-map.component').then(m => m.MajstorMapComponent) },
  { path: 'kupac', loadComponent: () => import('./pages/landing-kupac/landing-kupac.component').then(m => m.LandingKupacComponent) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent), canActivate: [authGuard] },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'kupac/register', loadComponent: () => import('./pages/kupac-register/kupac-register.component').then(m => m.KupacRegisterComponent) },
  { path: 'kupac/moj-profil', loadComponent: () => import('./pages/kupac-moj-profil/kupac-moj-profil.component').then(m => m.KupacMojProfilComponent) },
  { path: 'kupac/edit-profile/:id', loadComponent: () => import('./pages/kupac-edit-profile/kupac-edit-profile.component').then(m => m.KupacEditProfileComponent) },
  { path: 'kupac/delete-profile/:id', loadComponent: () => import('./pages/kupac-delete-profile/kupac-delete-profile.component').then(m => m.KupacDeleteProfileComponent) },
  { path: 'oglasi', loadComponent: () => import('./pages/oglasi/oglas-list.component').then(m => m.OglasListComponent) },
  { path: 'oglasi/create', loadComponent: () => import('./pages/oglasi/create-oglas-wizard/create-oglas-wizard.component').then(m => m.CreateOglasWizardComponent), canActivate: [majstorGuard] },
  { path: 'oglasi/:id', loadComponent: () => import('./pages/oglas-qr/oglas-qr.component').then(m => m.OglasQrComponent) },
  { path: 'kupci', loadComponent: () => import('./pages/kupci/kupci.component').then(m => m.KupciComponent) },
  { path: 'razgovori', loadComponent: () => import('./pages/razgovori/razgovori-list.component').then(m => m.RazgovoriListComponent) },
  { path: 'razgovori/:id', loadComponent: () => import('./pages/razgovori/razgovor.component').then(m => m.RazgovorComponent) },
  { path: 'recenzije', loadComponent: () => import('./pages/recenzije/recenzije.component').then(m => m.RecenzijeComponent) },
  { path: 'krediti', loadComponent: () => import('./pages/krediti/krediti.component').then(m => m.KreditiComponent) },
  { path: 'ugovori', loadComponent: () => import('./pages/ugovori/ugovori.component').then(m => m.UgovoriComponent) },
  { path: '**', redirectTo: '' }
];
