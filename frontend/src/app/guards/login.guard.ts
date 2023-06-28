import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {isTokenExpired, removeAccessToken} from '../models/token';

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (isTokenExpired()) {
      // token expired he can log in again
      return true;
    }

    // token not expired so redirect to main page with the return url
    await this.router.navigate(['/patient-list']);
    return false;
  }
}
