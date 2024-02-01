import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-modal',
  templateUrl: './small-modal.component.html',
  styleUrl: './small-modal.component.css'
})
export class SmallModalComponent {
  public onConfirm: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SmallModalComponent>,
    private routes: Router,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  goToDetailPage() {
    this.routes.navigate(["home/detail", this.data.leaderNo]);
  }


  goToIndexPage(): void {
    this.closeDialog();
    this.routes.navigate(["home"]);
  }

  onRegister() {
    this.onConfirm.emit();
  }

}
