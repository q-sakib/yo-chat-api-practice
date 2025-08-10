import { Routes } from '@angular/router';
import { PermissionGuard } from './serve/permission.guard';
import { AuthGuard } from './serve/auth.guard';

export const routes: Routes = [
  // Redirect empty path to /messages
  {
    path: '',
    redirectTo: 'messages',
    pathMatch: 'full',
  },

  // ✅ Main Chat - accessible to authenticated users
  {
    path: 'messages',
    loadComponent: () =>
      import('./components/chat/chat').then((m) => m.Chat),
      // import('./all-users/all-users').then((m) => m.AllUsers),
    canActivate: [AuthGuard], // <-- MUST be uncommented
  },

  // ✅ Auth routes (login, register, etc.)
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/form/auth-dialog.component').then(
            (m) => m.AuthDialogComponent
          ),
      },
      // Add register/forgot-password here if needed
    ],
  },

  // ✅ Unauthorized route
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // ✅ Catch-all route (404 page)
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pageNotFound.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
