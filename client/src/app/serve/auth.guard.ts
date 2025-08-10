// src/app/auth/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    console.log('[AuthGuard] Checking login status...');

    if (this.auth.isLoggedIn()) {
      console.log('[AuthGuard] User is logged in');
      return true;
    } else {
      console.log(
        '[AuthGuard] User is NOT logged in. Redirecting to /auth/login'
      );
      return this.router.parseUrl('/auth/login');
    }
  }
}
