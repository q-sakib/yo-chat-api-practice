// src/app/auth/guards/permission.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';
// import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredPermissions = route.data['permissions'] as string[];

    if (!this.auth.isLoggedIn()) {
      return this.router.parseUrl('/auth/login');
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const hasPermission = requiredPermissions.some((perm) =>
      this.auth.hasPermission(perm)
    );

    return hasPermission ? true : this.router.parseUrl('/unauthorized');
  }
}
