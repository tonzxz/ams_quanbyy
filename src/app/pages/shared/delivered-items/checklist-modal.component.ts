// checklist-modal.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DeliveredItem, DeliveryItem } from '../../../services/delivered-items.service';

@Component({
  selector: 'app-checklist-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold">Checklist</h2>
          <p class="text-gray-600">{{data.supplierName}} - {{data.supplierId}}</p>
        </div>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let item of data.items">
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="font-medium">{{item.name}}</span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-gray-500">
              {{item.quantity}}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs rounded-full"
                    [ngClass]="item.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{item.isDelivered ? 'Delivered' : 'Pending'}}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <mat-checkbox 
                [(ngModel)]="item.isDelivered"
                (change)="updateItemStatus(item)"
                color="primary">
                Mark as Delivered
              </mat-checkbox>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
        <button mat-button (click)="dialogRef.close()">
          Cancel
        </button>
        <button mat-raised-button 
                color="primary"
                (click)="saveChanges()">
          Save Changes
        </button>
      </div>
    </div>
  `
})
export class ChecklistModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ChecklistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveredItem
  ) {}

  updateItemStatus(item: DeliveryItem) {
    item.status = item.isDelivered ? 'delivered' : 'pending';
  }

  saveChanges() {
    this.dialogRef.close({ items: this.data.items });
  }
}