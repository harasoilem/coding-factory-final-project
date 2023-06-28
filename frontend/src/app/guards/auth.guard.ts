import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {isTokenExpired, removeAccessToken} from '../models/token';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isTokenExpired()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    removeAccessToken();
    if (state.url !== '/') {
      await this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    } else {
      await this.router.navigate(['/login']);
    }
    return false;
  }
}
