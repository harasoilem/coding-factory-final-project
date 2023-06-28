import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {getAccessToken, removeAccessToken} from '../models/token';
import {TokenHelperService} from '../services/token-helper/token-helper.service';
import {UsernameItem} from "../helpers/local-storage/username-item";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router, public auth: TokenHelperService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(() => {
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }

          const accessToken = getAccessToken();

          if (accessToken != null && this.auth.isAuthenticated()) {
            removeAccessToken();
            new UsernameItem().removeItem();
            this.router.navigate(['/login']);
          }
        }
      }));
  }
}
