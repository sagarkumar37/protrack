import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router : Router,private toastr: ToastrService){}

  // canActivate(){
  //   if(this.auth.isLoggedin())
  //   return true;

  //   this.router.navigate(['/login']);
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isLoggedin()) {
      return true;
    } else {
      this.toastr.error('Please Login first to continue');
      return this.router.parseUrl('/login');
    }
  }
  
  
}
