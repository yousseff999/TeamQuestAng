import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    // Retrieve user role from the AuthService
    const userRole = this.authService.getRole();

    // If the user is not logged in, redirect to login
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // Retrieve the allowed roles from the route's data property
    const allowedRoles = next.data['roles'] as Array<string>;

    // If no roles are required, allow the navigation
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // If the user's role is allowed, proceed with navigation
    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      // If the user's role is not allowed, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
