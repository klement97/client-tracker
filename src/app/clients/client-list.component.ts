import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientService } from './services/client.service';


@Component({
  selector: 'app-client-list',
  template: `
      <div class="container">
          <form class="form">
              <mat-form-field class="full-width" appearance="fill">
                  <mat-label>Name</mat-label>
                  <input type="text"
                         placeholder="Write name..."
                         aria-label="Number"
                         matInput
                         [formControl]="myControl"
                         [matAutocomplete]="auto">
                  <mat-autocomplete #auto="matAutocomplete">
                      <mat-option *ngFor="let client of clients" [value]="client.name">
                          {{client.number}} - {{client.name}}
                      </mat-option>
                  </mat-autocomplete>
              </mat-form-field>
          </form>
      </div>

  `,
  styles: [`
      .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
      }

      .form {
          min-width: 150px;
          max-width: 500px;
          width: 100%;
      }

      .full-width {
          width: 100%;
      }
  `]
})
export class ClientListComponent implements OnInit {

  constructor(
    private clientService: ClientService
  ) { }


  myControl = new FormControl();
  clients: { number: number, name: string }[] = [];


  ngOnInit(): void {
    this.getClients();
  }


  getClients() {
    return this.clientService.getClients().subscribe(
      (response: any) => this.clients = response
    );
  }

}
