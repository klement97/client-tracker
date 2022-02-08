import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Client } from 'src/app/clients/models';
import { ClientService } from '../services/client.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientFormComponent } from './client-form.component';
import { DeleteConfirmComponent } from './delete-confirm.component';


@Component({
  selector: 'app-client-list',
  template: `
      <div class="container">
        <div class="row">

          <button mat-icon-button (click)="openClientForm()">
            <mat-icon style="color: green;">add</mat-icon>
          </button>

          <form class="form">
              <mat-form-field class="full-width" appearance="fill">
                  <mat-label>Name</mat-label>
                  <span class="row">
                    <input type="text"
                          placeholder="Write name..."
                          aria-label="Number"
                          matInput
                          [formControl]="myControl"
                          [matAutocomplete]="auto">
                    <button mat-icon-button (click)="cleanSelectedClient()" type="button">
                            <mat-icon>cancel</mat-icon>
                    </button>
                  </span>
                  <mat-autocomplete #auto="matAutocomplete">
                      <mat-option (onSelectionChange)="selectClient(client)" *ngFor="let client of $filteredOptions | async"
                       [value]="client.number + ' - ' + client.name">
                          {{client.number}} - {{client.name}}
                      </mat-option>
                  </mat-autocomplete>
              </mat-form-field>
          </form>

          <button mat-icon-button (click)="openClientForm(this.selectedClient)" [disabled]="!this.selectedClient">
            <mat-icon [ngClass]="{'colored-edit': this.selectedClient}">edit</mat-icon>
          </button>

          <button mat-icon-button (click)="deleteClient(this.selectedClient)" [disabled]="!this.selectedClient">
            <mat-icon [ngClass]="{'colored-delete': this.selectedClient}">delete</mat-icon>
          </button>
        </div>
      </div>

  `,
  styles: [`
      .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
      }

      .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
      }

      .form {
          min-width: 150px;
          max-width: 500px;
          width: 100%;
      }

      .full-width {
          width: 100%;
      }

      .colored-edit {
        color: orange;
      }

      .colored-delete {
        color: red;
      }
  `]
})
export class ClientListComponent implements OnInit {

  constructor(
    private clientService: ClientService,
    private matDialog: MatDialog,
  ) { }


  myControl = new FormControl();
  clients: { number: number, name: string }[] = [];
  $filteredOptions!: Observable<Client[]>;
  selectedClient: Client | null = null;


  ngOnInit(): void {
    this.getClients();
  }


  getClients() {
    this.clientService.getClients().subscribe(
      (response: any) => {
        this.clients = response;
        this.$filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.name)),
          map(name => (name ? this._filter(name) : this.clients.slice())),
        );
      }
    );
  }

  private _filter(name: string): Client[] {
    const filterValue = name.toLowerCase();

    return this.clients.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  openClientForm(client: Client | null = null) {
    const dialogRef = this.matDialog.open(ClientFormComponent, {
      data: { client }
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result?.created || result?.updated) {
          this.getClients();
          this.cleanSelectedClient();
        }
      }
    )
  }

  selectClient(client: Client) {
    console.log(client);
    this.selectedClient = client;
  }

  cleanSelectedClient() {
    this.selectedClient = null;
    this.myControl.setValue('');
  }

  deleteClient(client: Client | null) {
    if (!client) {
      return;
    }

    this.matDialog.open(DeleteConfirmComponent, { data: { client } })
      .afterClosed().subscribe(
        (result) => {
          if (result?.deleted) {
            this.getClients();
            this.cleanSelectedClient();
          }
        }
      );
  }

}
