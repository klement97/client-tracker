import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { _TOKEN } from 'src/app/auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.cookieService.check(_TOKEN)) {
      return true;
    } else {
      this.router.navigate(['/login']).then();
      return false;
    }
  }


  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.cookieService.check(_TOKEN)) {
      return true;
    } else {
      this.router.navigate(['/login']).then();
      return false;
    }
  }
}
