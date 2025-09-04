import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, Route, UrlSegment, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // convert to ms
    return Date.now() > exp;
  } catch (e) {
    return true; // treat malformed tokens as expired
  }
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.authService.getAccessToken();
    if (!token && isTokenExpired(token)) {
      // this.router.navigate(['/login']);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const token = this.authService.getAccessToken();;

    if (token && !isTokenExpired(token)) {
      let url: string = state.url;
      if (url.length > 1 && next.data.api_path != undefined)
        return this.checkUserRole(next, url);
      else
        return true;
    } else {
      this.router.navigate(['login']);
    }
  }

  canDeactivate(component: unknown, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  checkUserRole(route: ActivatedRouteSnapshot, url: any): boolean {
    let loggedInUser = this.authService.getUserData();
    let perm = loggedInUser.permissions.filter((el) => { return el.api_path == route.data.api_path })
    if (perm.length == 0) {
      console.log(route.data.api_path);
      return false;
    }
    return true;
  }

}
