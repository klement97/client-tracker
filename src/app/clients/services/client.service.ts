import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { _TOKEN } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Client } from '../models';

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

  createClient(client: Client) {
    return this.http.post(this.url, client, this.getOptions());
  }

  updateClient(client: Client) {
    return this.http.put(`${this.url}${client.number}/`, client, this.getOptions());
  }

  deleteClient(clientNumber: number) {
    return this.http.delete(`${this.url}${clientNumber}/`, this.getOptions());
  }

}
