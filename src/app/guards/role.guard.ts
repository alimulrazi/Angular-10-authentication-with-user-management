import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, Route, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = next.data.expectedRole;
    const userRole = this.authService.getUserRole();

    if (this.authService.getAccessToken() && userRole === expectedRole) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }

}
