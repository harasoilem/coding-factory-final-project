import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getAccessToken} from '../models/token';
import {TokenHelperService} from '../services/token-helper/token-helper.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public auth: TokenHelperService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
