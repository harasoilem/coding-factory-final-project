import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {getAccessToken} from '../../models/token';

@Injectable({
  providedIn: 'root'
})
export class TokenHelperService {
  public isAuthenticated(): boolean {
    const helper = new JwtHelperService();

    // get the token
    const token = getAccessToken();
    // return a boolean reflecting
    // whether the token is expired
    const isExpired = helper.isTokenExpired(token ?? undefined);
    return !isExpired;
  }
}
