import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth2Service } from './auth2.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {
  constructor(private authService: Auth2Service, private router: Router) { }

  canActivate(): boolean {
    this.authService.checkUserRole();  // Fetch and set the user role
    if (this.authService.isAuthenticated()) {
      return true;  // User is authenticated, allow access
    } else {
      // User is not authenticated, redirect to login or unauthorized page
      this.router.navigate(['/login']);  // Modify the route to your login page
      return false;
    }
  }
}
