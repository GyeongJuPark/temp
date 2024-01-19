import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-large-modal',
  templateUrl: './large-modal.component.html',
  styleUrl: './large-modal.component.css'
})
export class LargeModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LargeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
