import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';


export const _TOKEN = 'client_tracker_token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) { }


  getOptions() {
    return {
      headers: { Authorization: `Token ${this.cookieService.get(_TOKEN)}` }
    };
  }


  login(username: string, password: string) {
    const url = `${environment.apiHost}/token-login/`;
    const body = { username, password };
    const options = this.getOptions();
    return this.http.post(url, body, options).pipe(
      map((res: any) => res['token']),
      tap(token => this.cookieService.set(_TOKEN, token)),
    );
  }
}
