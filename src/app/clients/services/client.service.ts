import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { _TOKEN } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  url = `${environment.apiHost}/clients/`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }


  getOptions() {
    return {
      headers: {
        'Authorization': `Token ${this.cookieService.get(_TOKEN)}`
      }
    }
  }


  getClients(): Observable<any> {
    return this.http.get(this.url, this.getOptions());
  }
}
