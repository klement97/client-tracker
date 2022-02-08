import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-form',
  template: `
    <div class="container">
      <p>Create a new client</p>
      <form class="form" [formGroup]="clientForm">
        <mat-form-field appearance="fill">
          <mat-label>Number</mat-label>
          <input matInput
                  type="number"
                  autofocus
                  placeholder="Write number..."
                  aria-label="Number"
                  formControlName="number">
        </mat-form-field>
        <mat-error *ngIf="error.number">{{error.number}}</mat-error>

        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput
                  type="text"
                  placeholder="Write name..."
                  aria-label="Name"
                  formControlName="name">
        </mat-form-field>
        <mat-error *ngIf="error.name">{{error.name}}</mat-error>

        
        <div class="row">
          <button mat-stroked-button (click)="onCancel()" type="button">Cancel</button> &nbsp;
          <button mat-raised-button color="primary" (click)="onSubmit()" type="submit">Submit</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .form {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ClientFormComponent implements OnInit {

  clientForm: FormGroup;
  isUpdate: boolean;
  error = { number: '', name: '' };

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private snackBar: MatSnackBar
  ) {
    this.isUpdate = !!this.data.client;
    this.clientForm = this._getClientForm();
  }

  ngOnInit(): void {
  }

  private _getClientForm() {
    let number, name = '';
    if (this.isUpdate) {
      number = this.data.client.number;
      name = this.data.client.name;
    }
    const form = this.fb.group({
      name: [name, [Validators.required]],
      number: [number, [Validators.required]],
    });
    if (this.isUpdate) {
      form.controls['number'].disable();
    }

    return form;
  }

  createClient() {
    this.error = { number: '', name: '' };
    this.clientService.createClient(this.clientForm.value).subscribe({
      next: () => {
        this.dialogRef.close({ created: true });
        this.snackBar.open('Client created successfully!', '', { duration: 2000 });
      },
      error: err => this.setError(err),
    })
  }

  updateClient() {
    this.error = { number: '', name: '' };
    // Get client number from data, because the form control has been disabled.
    const client = { number: this.data.client.number, ...this.clientForm.value };
    this.clientService.updateClient(client).subscribe({
      next: () => {
        this.dialogRef.close({ updated: true });
        this.snackBar.open('Client updated successfully!', '', { duration: 2000 });
      },
      error: err => this.setError(err),
    })
  }

  setError(err: any) {
    this.error.name = err.error.name ? err.error.name[0] : '';
    this.error.number = err.error.number ? err.error.number[0] : '';
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.isUpdate) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

}
