import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APIResponse, LoginResponse, removeAccessToken, Token} from '../../models/token';
import {lastValueFrom} from "rxjs";
import {LoginRequest} from "../../models/login_request";

@Injectable({providedIn: 'root'})
export class ApiAuthService {

  constructor(private http: HttpClient) {
  }

  endpoint = environment.http + '://' + environment.authUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: LoginRequest): Promise<LoginResponse | undefined> {
    return lastValueFrom(this.http.post<LoginResponse>(this.endpoint + '/login', JSON.stringify(loginRequest), this.httpOptions));
  }

  logout() {
    // remove user from local storage to log user out
    removeAccessToken();
  }


}
