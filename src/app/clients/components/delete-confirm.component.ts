import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-delete-confirm',
  template: `
    <h1 mat-dialog-title>Delete Client</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete client: "{{data.client.number}} - {{data.client.name}}" ?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-stroked-button color="primary" cdkFocusInitial (click)="onYesClick()">Yes</button>
    </div>
  `,
  styles: [
  ]
})
export class DeleteConfirmComponent implements OnInit {

  constructor(
    private clientService: ClientService,
    private dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.clientService.deleteClient(this.data.client.number).subscribe({
      next: () => {
        this.dialogRef.close({ deleted: true });
        this.snackBar.open('Client deleted successfully!', '', { duration: 2000 });
      },
      error: err => {
        this.snackBar.open('Error deleting client: ' + err.error.message, '', { duration: 2000 });
      },
    })
  }

}
