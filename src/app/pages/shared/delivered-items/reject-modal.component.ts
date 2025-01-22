// reject-modal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Reject Delivery</h2>
      <mat-form-field class="w-full">
        <textarea matInput 
                  [(ngModel)]="reason" 
                  placeholder="Please provide reason for rejection"
                  rows="4"></textarea>
      </mat-form-field>
      <div class="flex justify-end gap-2 mt-4">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button 
                color="warn"
                [disabled]="!reason"
                (click)="submitRejection()">
          Reject Delivery
        </button>
      </div>
    </div>
  `
})
export class RejectModalComponent {
  reason = '';

  constructor(private dialogRef: MatDialogRef<RejectModalComponent>) {}

  submitRejection() {
    if (this.reason) {
      this.dialogRef.close(this.reason);
    }
  }
}