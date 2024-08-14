import { Injectable,Provider } from '@angular/core'; 
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'; 
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    throw new Error('Method not implemented.');
  }

  Intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var isAuthAPI: boolean;

    if(request.url.startsWith('login') || request.url.startsWith('register')){
      isAuthAPI = true;
    } else {
      isAuthAPI = false;
    }

    if(this.authenticationService.isLoggedIn() && !isAuthAPI) {
      let token = this.authenticationService.getToken();

      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor, multi:true
};