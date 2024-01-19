import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-modal',
  templateUrl: './small-modal.component.html',
  styleUrl: './small-modal.component.css'
})
export class SmallModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SmallModalComponent>,
    private routes: Router,
  @Inject(MAT_DIALOG_DATA) public data: any
  ){ }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
  goToIndexPage(): void {
    this.closeDialog();
    this.routes.navigate(["home"]);
  }

}